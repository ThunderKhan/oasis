/**
 * Shared types mirroring the FastAPI backend contract.
 * Do not modify shapes without a matching backend change.
 */

export type UrgencyCategory =
  | "routine"
  | "screening_due"
  | "priority_screening"
  | "specialist_risk_assessment"
  | "clinical_follow_up"
  | "prompt_referral"

export type CancerType = "oral" | "breast" | "cervical"

export type SexAtBirth =
  | "female"
  | "male"
  | "intersex"
  | "unknown"

export interface PatientInput {
  patient_code: string
  age: number
  sex_at_birth: SexAtBirth
  consent_given: boolean
}

export interface OralInput {
  screened_before: boolean
  years_since_screening: number | null
  smoking_current: boolean
  smokeless_tobacco_current: boolean
  areca_nut_current: boolean
  alcohol_high_exposure: boolean
  exposure_years: number
  non_healing_ulcer: boolean
  white_patch: boolean
  red_patch: boolean
  oral_growth: boolean
  unexplained_bleeding: boolean
  restricted_mouth_opening: boolean
  difficulty_swallowing: boolean
  neck_lump: boolean
  abnormal_exam: boolean
}

export interface BreastInput {
  applicable: boolean
  screened_before: boolean
  years_since_cbe: number | null
  new_breast_lump: boolean
  axillary_lump: boolean
  bloody_nipple_discharge: boolean
  new_nipple_inversion: boolean
  skin_dimpling_or_peau_dorange: boolean
  breast_ulceration: boolean
  abnormal_cbe: boolean
  previous_breast_cancer: boolean
  known_pathogenic_variant: boolean
  previous_chest_radiation: boolean
  atypical_hyperplasia_or_lcis: boolean
  first_degree_relatives: number
  relative_diagnosed_before_50: boolean
}

export interface CervicalInput {
  applicable: boolean
  screened_before: boolean
  years_since_screening: number | null
  living_with_hiv: boolean | null
  previous_positive_hpv: boolean
  previous_abnormal_via_or_cytology: boolean
  postcoital_bleeding: boolean
  postmenopausal_bleeding: boolean
  unexplained_persistent_bleeding: boolean
  persistent_foul_discharge: boolean
  pelvic_pain: boolean
  abnormal_cervical_exam: boolean
  number_of_sexual_partners: number | null
  first_sexual_intercourse_age: number | null
  number_of_pregnancies: number | null
  smoking_current: boolean | null
  smoking_years: number | null
  hormonal_contraceptive_years: number | null
  iud_years: number | null
  std_history: boolean | null
  std_diagnoses_count: number | null
}

export interface AssessmentInput {
  patient: PatientInput
  oral: OralInput
  breast: BreastInput
  cervical: CervicalInput
}

export interface ReasonEntry {
  factor: string
  effect: string
  evidence_key?: string | null
}

export interface PathwayResult {
  cancer_type: CancerType
  priority: UrgencyCategory
  priority_score: number
  red_flags: string[]
  reasons: ReasonEntry[]
  recommended_action: string
  screening_due: boolean
  experimental_model_probability: number | null
  model_version: string
  limitations: string[]
}

export interface AssessmentResponse {
  assessment_id: string
  patient_code: string
  overall_priority: UrgencyCategory
  results: Partial<Record<CancerType, PathwayResult>>
  disclaimer: string
}

export interface AssessmentSummary {
  assessment_id: string
  patient_code: string
  overall_priority: UrgencyCategory
  created_at: string
}

export interface HealthResponse {
  status: "ok"
  cervical_model_loaded: boolean
}

