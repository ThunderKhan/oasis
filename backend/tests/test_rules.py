from app.schemas import Patient, OralInput, BreastInput, CervicalInput, Priority
from app.rules import assess_oral, assess_breast, assess_cervical
P=Patient(patient_code="TEST",age=42,sex_at_birth="female",consent_given=True)
def test_oral_red_flag_overrides(): assert assess_oral(P,OralInput(white_patch=True)).priority==Priority.PROMPT_REFERRAL
def test_oral_high_exposure(): assert assess_oral(P,OralInput(smokeless_tobacco_current=True,areca_nut_current=True,exposure_years=12)).priority==Priority.PRIORITY_SCREENING
def test_breast_lump_refers(): assert assess_breast(P,BreastInput(new_breast_lump=True)).priority==Priority.PROMPT_REFERRAL
def test_cervical_prior_abnormal_followup(): assert assess_cervical(P,CervicalInput(previous_positive_hpv=True)).priority==Priority.CLINICAL_FOLLOW_UP
def test_symptom_beats_low_model(): assert assess_cervical(P,CervicalInput(postcoital_bleeding=True),.01,.20).priority==Priority.PROMPT_REFERRAL
