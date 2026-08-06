import type { AssessmentInput } from "./assessment-types"

/** Blank starting state for a new assessment. */

/** Generate a non-identifying code in the browser after hydration. */
export function generatePatientCode(): string {
  const year = new Date().getFullYear()
  const values = new Uint8Array(2)
  window.crypto.getRandomValues(values)
  const suffix = Array.from(values, (value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()

  return `OASIS-${year}-${suffix}`
}

export function createInitialAssessment(): AssessmentInput {
  return {
    patient: {
      patient_code: "",
      age: 0,
      sex_at_birth: "female",
      consent_given: false,
    },
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
