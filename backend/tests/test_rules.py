import pytest
from pydantic import ValidationError

from app.rules import assess_breast, assess_cervical, assess_oral
from app.schemas import AssessmentRequest, BreastInput, CervicalInput, OralInput, Patient, Priority

P = Patient(patient_code="TEST", age=42, sex_at_birth="female", consent_given=True)

def test_oral_red_flag_overrides():
    assert assess_oral(P, OralInput(white_patch=True)).priority == Priority.PROMPT_REFERRAL

def test_oral_high_exposure():
    result = assess_oral(P, OralInput(smokeless_tobacco_current=True, areca_nut_current=True, exposure_years=12))
    assert result.priority == Priority.PRIORITY_SCREENING

def test_oral_screening_due():
    result = assess_oral(P, OralInput(screened_before=False))
    assert result.priority == Priority.SCREENING_DUE
    assert result.screening_due is True

def test_breast_lump_refers():
    assert assess_breast(P, BreastInput(new_breast_lump=True)).priority == Priority.PROMPT_REFERRAL

def test_breast_high_risk_goes_to_specialist():
    result = assess_breast(P, BreastInput(screened_before=True, years_since_cbe=1, known_pathogenic_variant=True))
    assert result.priority == Priority.SPECIALIST_ASSESSMENT

def test_breast_inapplicable_ignores_stale_values():
    result = assess_breast(P, BreastInput(applicable=False, new_breast_lump=True, known_pathogenic_variant=True))
    assert result.priority == Priority.ROUTINE
    assert result.red_flags == []
    assert result.screening_due is False

def test_cervical_prior_abnormal_followup():
    assert assess_cervical(P, CervicalInput(previous_positive_hpv=True)).priority == Priority.CLINICAL_FOLLOW_UP

def test_symptom_beats_low_model():
    result = assess_cervical(P, CervicalInput(postcoital_bleeding=True), probability=.01, threshold=.20)
    assert result.priority == Priority.PROMPT_REFERRAL

def test_cervical_high_model_can_upgrade_due_screening():
    result = assess_cervical(P, CervicalInput(screened_before=False), probability=.80, threshold=.20)
    assert result.screening_due is True
    assert result.priority == Priority.PRIORITY_SCREENING

def test_cervical_inapplicable_ignores_model_and_stale_values():
    result = assess_cervical(
        P,
        CervicalInput(applicable=False, postcoital_bleeding=True, previous_positive_hpv=True),
        probability=.99,
        threshold=.20,
    )
    assert result.priority == Priority.ROUTINE
    assert result.experimental_model_probability is None
    assert result.red_flags == []

def test_hiv_cervical_interval_is_three_years():
    patient = Patient(patient_code="HIV", age=28, sex_at_birth="female", consent_given=True)
    result = assess_cervical(
        patient,
        CervicalInput(living_with_hiv=True, screened_before=True, years_since_screening=3),
    )
    assert result.priority == Priority.SCREENING_DUE

def test_missing_consent_is_rejected():
    with pytest.raises(ValidationError):
        Patient(patient_code="NO-CONSENT", age=42, sex_at_birth="female")

def test_false_consent_is_rejected_by_assessment():
    with pytest.raises(ValidationError):
        AssessmentRequest(
            patient=Patient(patient_code="NO-CONSENT", age=42, sex_at_birth="female", consent_given=False),
            oral=OralInput(),
            breast=BreastInput(),
            cervical=CervicalInput(),
        )
