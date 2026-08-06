import type { AssessmentPayload } from "./assessment-types"

const PATIENT_CODE_SEQUENCE_KEY = "oasis.patient-code-sequence"

/** Creates a session-scoped, non-identifying code such as OASIS-2026-001. */
export function generatePatientCode(): string {
  const year = new Date().getFullYear()
  let sequence = 1

  if (typeof window !== "undefined") {
    const previous = Number.parseInt(window.sessionStorage.getItem(PATIENT_CODE_SEQUENCE_KEY) ?? "0", 10)
    sequence = Number.isFinite(previous) ? (previous % 999) + 1 : 1
    window.sessionStorage.setItem(PATIENT_CODE_SEQUENCE_KEY, String(sequence))
  }

  return `OASIS-${year}-${String(sequence).padStart(3, "0")}`
}

/** Safe blank state. It contains no names, contact details, or other direct identifiers. */
export function createInitialAssessment(): AssessmentPayload {
  return {
    patient: { patient_code: "", age: 0, sex_at_birth: "unknown", consent_given: false },
    oral: {
      screened_before: false,
      years_since_screening: null,
      smoking_current: false,
      smokeless_tobacco_current: false,
      areca_nut_current: false,
      alcohol_high_exposure: false,
      exposure_years: 0,
      non_healing_ulcer: false,
      white_patch: false,
      red_patch: false,
      oral_growth: false,
      unexplained_bleeding: false,
      restricted_mouth_opening: false,
      difficulty_swallowing: false,
      neck_lump: false,
      abnormal_exam: false,
    },
    breast: {
      applicable: true,
      screened_before: false,
      years_since_cbe: null,
      new_breast_lump: false,
      axillary_lump: false,
      bloody_nipple_discharge: false,
      new_nipple_inversion: false,
      skin_dimpling_or_peau_dorange: false,
      breast_ulceration: false,
      abnormal_cbe: false,
      previous_breast_cancer: false,
      known_pathogenic_variant: false,
      previous_chest_radiation: false,
      atypical_hyperplasia_or_lcis: false,
      first_degree_relatives: 0,
      relative_diagnosed_before_50: false,
    },
    cervical: {
      applicable: true,
      screened_before: false,
      years_since_screening: null,
      living_with_hiv: null,
      previous_positive_hpv: false,
      previous_abnormal_via_or_cytology: false,
      postcoital_bleeding: false,
      postmenopausal_bleeding: false,
      unexplained_persistent_bleeding: false,
      persistent_foul_discharge: false,
      pelvic_pain: false,
      abnormal_cervical_exam: false,
      number_of_sexual_partners: null,
      first_sexual_intercourse_age: null,
      number_of_pregnancies: null,
      smoking_current: null,
      smoking_years: null,
      hormonal_contraceptive_years: null,
      iud_years: null,
      std_history: null,
      std_diagnoses_count: null,
    },
  }
}
