from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, model_validator

class Priority(str, Enum):
    ROUTINE = "routine"
    SCREENING_DUE = "screening_due"
    PRIORITY_SCREENING = "priority_screening"
    SPECIALIST_ASSESSMENT = "specialist_risk_assessment"
    CLINICAL_FOLLOW_UP = "clinical_follow_up"
    PROMPT_REFERRAL = "prompt_referral"

PRIORITY_RANK = {
    Priority.ROUTINE: 0,
    Priority.SCREENING_DUE: 1,
    Priority.PRIORITY_SCREENING: 2,
    Priority.SPECIALIST_ASSESSMENT: 3,
    Priority.CLINICAL_FOLLOW_UP: 4,
    Priority.PROMPT_REFERRAL: 5,
}

class Patient(BaseModel):
    patient_code: str = Field(min_length=1, max_length=64)
    age: int = Field(ge=0, le=120)
    sex_at_birth: Literal["female", "male", "intersex", "unknown"]
    consent_given: bool = True

class OralInput(BaseModel):
    screened_before: bool = False
    years_since_screening: float | None = Field(default=None, ge=0, le=100)
    smoking_current: bool = False
    smokeless_tobacco_current: bool = False
    areca_nut_current: bool = False
    alcohol_high_exposure: bool = False
    exposure_years: float = Field(default=0, ge=0, le=100)
    non_healing_ulcer: bool = False
    white_patch: bool = False
    red_patch: bool = False
    oral_growth: bool = False
    unexplained_bleeding: bool = False
    restricted_mouth_opening: bool = False
    difficulty_swallowing: bool = False
    neck_lump: bool = False
    abnormal_exam: bool = False

class BreastInput(BaseModel):
    applicable: bool = True
    screened_before: bool = False
    years_since_cbe: float | None = Field(default=None, ge=0, le=100)
    new_breast_lump: bool = False
    axillary_lump: bool = False
    bloody_nipple_discharge: bool = False
    new_nipple_inversion: bool = False
    skin_dimpling_or_peau_dorange: bool = False
    breast_ulceration: bool = False
    abnormal_cbe: bool = False
    previous_breast_cancer: bool = False
    known_pathogenic_variant: bool = False
    previous_chest_radiation: bool = False
    atypical_hyperplasia_or_lcis: bool = False
    first_degree_relatives: int = Field(default=0, ge=0, le=10)
    relative_diagnosed_before_50: bool = False

class CervicalInput(BaseModel):
    applicable: bool = True
    screened_before: bool = False
    years_since_screening: float | None = Field(default=None, ge=0, le=100)
    living_with_hiv: bool | None = None
    previous_positive_hpv: bool = False
    previous_abnormal_via_or_cytology: bool = False
    postcoital_bleeding: bool = False
    postmenopausal_bleeding: bool = False
    unexplained_persistent_bleeding: bool = False
    persistent_foul_discharge: bool = False
    pelvic_pain: bool = False
    abnormal_cervical_exam: bool = False
    # Optional research-dataset-style variables for the experimental model
    number_of_sexual_partners: float | None = Field(default=None, ge=0, le=100)
    first_sexual_intercourse_age: float | None = Field(default=None, ge=0, le=100)
    number_of_pregnancies: float | None = Field(default=None, ge=0, le=30)
    smoking_current: bool | None = None
    smoking_years: float | None = Field(default=None, ge=0, le=100)
    hormonal_contraceptive_years: float | None = Field(default=None, ge=0, le=80)
    iud_years: float | None = Field(default=None, ge=0, le=80)
    std_history: bool | None = None
    std_diagnoses_count: float | None = Field(default=None, ge=0, le=50)

class AssessmentRequest(BaseModel):
    patient: Patient
    oral: OralInput
    breast: BreastInput
    cervical: CervicalInput

    @model_validator(mode="after")
    def consent_required(self):
        if not self.patient.consent_given:
            raise ValueError("Assessment requires recorded patient consent")
        return self

class Reason(BaseModel):
    factor: str
    effect: str
    evidence_key: str | None = None

class CancerAssessment(BaseModel):
    cancer_type: Literal["oral", "breast", "cervical"]
    priority: Priority
    priority_score: int = Field(ge=0, le=100)
    red_flags: list[str]
    reasons: list[Reason]
    recommended_action: str
    screening_due: bool
    experimental_model_probability: float | None = Field(default=None, ge=0, le=1)
    model_version: str
    limitations: list[str] = []

class AssessmentResponse(BaseModel):
    assessment_id: str
    patient_code: str
    overall_priority: Priority
    results: dict[str, CancerAssessment]
    disclaimer: str
