import type { AssessmentInput } from "./assessment-types"
import { createInitialAssessment } from "./initial-assessment"

export interface DemoScenario {
  id: string
  /** Explicitly labelled as demo data — never real patients */
  label: string
  summary: string
  input: AssessmentInput
}

function base(): AssessmentInput {
  return createInitialAssessment()
}

const oralRedFlag: AssessmentInput = {
  ...base(),
  patient: { patient_code: "OASIS-001", age: 42, sex_at_birth: "female", consent_given: true },
  oral: {
    ...base().oral,
    screened_before: true,
    years_since_screening: 6,
    smokeless_tobacco_current: true,
    areca_nut_current: true,
    exposure_years: 15,
    white_patch: true,
  },
  breast: { ...base().breast, applicable: true, screened_before: true, years_since_cbe: 6 },
  cervical: { ...base().cervical, applicable: true, number_of_pregnancies: 3 },
}

const routineLowRisk: AssessmentInput = {
  ...base(),
  patient: { patient_code: "OASIS-002", age: 28, sex_at_birth: "female", consent_given: true },
  oral: { ...base().oral, screened_before: true, years_since_screening: 1 },
  breast: { ...base().breast, applicable: true, screened_before: true, years_since_cbe: 1 },
  cervical: { ...base().cervical, applicable: true, screened_before: true, years_since_screening: 2 },
}

const breastFamilyHistory: AssessmentInput = {
  ...base(),
  patient: { patient_code: "OASIS-003", age: 38, sex_at_birth: "female", consent_given: true },
  oral: { ...base().oral, screened_before: true, years_since_screening: 2 },
  breast: {
    ...base().breast,
    applicable: true,
    screened_before: true,
    years_since_cbe: 3,
    first_degree_relatives: 2,
    relative_diagnosed_before_50: true,
  },
  cervical: { ...base().cervical, applicable: true, screened_before: true, years_since_screening: 3 },
}

const cervicalSymptoms: AssessmentInput = {
  ...base(),
  patient: { patient_code: "OASIS-004", age: 51, sex_at_birth: "female", consent_given: true },
  oral: { ...base().oral, screened_before: true, years_since_screening: 2 },
  breast: { ...base().breast, applicable: true, screened_before: true, years_since_cbe: 2 },
  cervical: {
    ...base().cervical,
    applicable: true,
    screened_before: false,
    postmenopausal_bleeding: true,
    persistent_foul_discharge: true,
  },
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "oral-red-flag",
    label: "Demo: oral red flag",
    summary: "42-year-old with persistent white oral patch, smokeless tobacco and areca nut use.",
    input: oralRedFlag,
  },
  {
    id: "routine-low-risk",
    label: "Demo: routine, up-to-date",
    summary: "28-year-old with recent screening across all pathways and no risk factors.",
    input: routineLowRisk,
  },
  {
    id: "breast-family-history",
    label: "Demo: breast family history",
    summary: "38-year-old with two first-degree relatives, one diagnosed before 50.",
    input: breastFamilyHistory,
  },
  {
    id: "cervical-symptoms",
    label: "Demo: cervical symptoms",
    summary: "51-year-old, never screened, with postmenopausal bleeding and persistent discharge.",
    input: cervicalSymptoms,
  },
]
