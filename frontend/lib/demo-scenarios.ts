import type { AssessmentPayload, CancerType, Priority } from "./assessment-types"
import { createInitialAssessment } from "./initial-assessment"

export interface DemoScenario {
  id: "oral-red-flag" | "breast-symptom" | "cervical-follow-up"
  label: string
  summary: string
  expected: { pathway: CancerType; priority: Priority }
  input: AssessmentPayload
}

function blank(): AssessmentPayload {
  return createInitialAssessment()
}

const oralRedFlag = blank()
oralRedFlag.patient = {
  patient_code: "OASIS-DEMO-A",
  age: 42,
  sex_at_birth: "female",
  consent_given: true,
}
oralRedFlag.oral = {
  ...oralRedFlag.oral,
  screened_before: true,
  years_since_screening: 6,
  smokeless_tobacco_current: true,
  areca_nut_current: true,
  exposure_years: 15,
  white_patch: true,
}

const breastSymptom = blank()
breastSymptom.patient = {
  patient_code: "OASIS-DEMO-B",
  age: 48,
  sex_at_birth: "female",
  consent_given: true,
}
breastSymptom.breast = {
  ...breastSymptom.breast,
  screened_before: false,
  years_since_cbe: null,
  new_breast_lump: true,
}

const cervicalFollowUp = blank()
cervicalFollowUp.patient = {
  patient_code: "OASIS-DEMO-C",
  age: 37,
  sex_at_birth: "female",
  consent_given: true,
}
cervicalFollowUp.cervical = {
  ...cervicalFollowUp.cervical,
  previous_positive_hpv: true,
  postcoital_bleeding: false,
  postmenopausal_bleeding: false,
  unexplained_persistent_bleeding: false,
  persistent_foul_discharge: false,
  pelvic_pain: false,
  abnormal_cervical_exam: false,
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "oral-red-flag",
    label: "Demo A: Oral Red Flag",
    summary: "Persistent white patch after 15 years of smokeless tobacco and areca nut exposure.",
    expected: { pathway: "oral", priority: "prompt_referral" },
    input: oralRedFlag,
  },
  {
    id: "breast-symptom",
    label: "Demo B: Breast Symptom",
    summary: "New breast lump in a 48-year-old with no prior clinical breast screening.",
    expected: { pathway: "breast", priority: "prompt_referral" },
    input: breastSymptom,
  },
  {
    id: "cervical-follow-up",
    label: "Demo C: Cervical Follow-up",
    summary: "Previous positive HPV result without current cervical warning symptoms.",
    expected: { pathway: "cervical", priority: "clinical_follow_up" },
    input: cervicalFollowUp,
  },
]

export function getDemoScenario(id: DemoScenario["id"]): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((scenario) => scenario.id === id)
}
