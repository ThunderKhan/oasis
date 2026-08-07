import { z } from "zod"
import type { AssessmentInput } from "./assessment-types"

/**
 * Zod validation for each wizard step. Field-level errors are keyed by
 * the same property names used in AssessmentInput so steps can map them
 * straight onto inputs.
 */

export const patientSchema = z
  .object({
    patient_code: z
      .string()
      .trim()
      .min(1, "Enter a patient code.")
      .max(64, "Patient code must be 64 characters or fewer."),
    age: z
      .number({ message: "Enter the patient's age in years." })
      .int("Age must be a whole number.")
      .min(0, "Age cannot be negative.")
      .max(120, "Enter an age of 120 or less."),
    sex_at_birth: z.enum(["female", "male", "intersex", "unknown"]),
    consent_given: z.boolean().refine((v) => v === true, {
      message: "Verbal consent must be confirmed before continuing.",
    }),
  })
  .strict()

export const oralSchema = z
  .object({
    screened_before: z.boolean(),
    years_since_screening: z.number().min(0).max(100).nullable(),
    smoking_current: z.boolean(),
    smokeless_tobacco_current: z.boolean(),
    areca_nut_current: z.boolean(),
    alcohol_high_exposure: z.boolean(),
    exposure_years: z
      .number({ message: "Enter total years of exposure (0 if none)." })
      .min(0, "Exposure years cannot be negative.")
      .max(100, "Enter 100 years or less."),
    non_healing_ulcer: z.boolean(),
    white_patch: z.boolean(),
    red_patch: z.boolean(),
    oral_growth: z.boolean(),
    unexplained_bleeding: z.boolean(),
    restricted_mouth_opening: z.boolean(),
    difficulty_swallowing: z.boolean(),
    neck_lump: z.boolean(),
    abnormal_exam: z.boolean(),
  })
  .strict()

export const breastSchema = z
  .object({
    applicable: z.boolean(),
    screened_before: z.boolean(),
    years_since_cbe: z.number().min(0).max(100).nullable(),
    new_breast_lump: z.boolean(),
    axillary_lump: z.boolean(),
    bloody_nipple_discharge: z.boolean(),
    new_nipple_inversion: z.boolean(),
    skin_dimpling_or_peau_dorange: z.boolean(),
    breast_ulceration: z.boolean(),
    abnormal_cbe: z.boolean(),
    previous_breast_cancer: z.boolean(),
    known_pathogenic_variant: z.boolean(),
    previous_chest_radiation: z.boolean(),
    atypical_hyperplasia_or_lcis: z.boolean(),
    first_degree_relatives: z
      .number({ message: "Enter the number of first-degree relatives (0 if none)." })
      .int("Must be a whole number.")
      .min(0, "Cannot be negative.")
      .max(10, "Enter 10 or fewer."),
    relative_diagnosed_before_50: z.boolean(),
  })
  .strict()

export const cervicalSchema = z
  .object({
    applicable: z.boolean(),
    screened_before: z.boolean(),
    years_since_screening: z.number().min(0).max(100).nullable(),
    living_with_hiv: z.boolean().nullable(),
    previous_positive_hpv: z.boolean(),
    previous_abnormal_via_or_cytology: z.boolean(),
    postcoital_bleeding: z.boolean(),
    postmenopausal_bleeding: z.boolean(),
    unexplained_persistent_bleeding: z.boolean(),
    persistent_foul_discharge: z.boolean(),
    pelvic_pain: z.boolean(),
    abnormal_cervical_exam: z.boolean(),
    number_of_sexual_partners: z.number().min(0).max(100).nullable(),
    first_sexual_intercourse_age: z.number().min(0).max(100).nullable(),
    number_of_pregnancies: z.number().min(0).max(30).nullable(),
    smoking_current: z.boolean().nullable(),
    smoking_years: z.number().min(0).max(100).nullable(),
    hormonal_contraceptive_years: z.number().min(0).max(80).nullable(),
    iud_years: z.number().min(0).max(80).nullable(),
    std_history: z.boolean().nullable(),
    std_diagnoses_count: z.number().int().min(0).max(50).nullable(),
  })
  .strict()

export const assessmentSchema = z.object({
  patient: patientSchema,
  oral: oralSchema,
  breast: breastSchema,
  cervical: cervicalSchema,
})

export type FieldErrors = Record<string, string>

/**
 * Validate one section and return a flat map of field → first error message.
 * Returns an empty object when the section is valid.
 */
export function validateSection(
  section: keyof AssessmentInput,
  data: unknown,
): FieldErrors {
  const schema = {
    patient: patientSchema,
    oral: oralSchema,
    breast: breastSchema,
    cervical: cervicalSchema,
  }[section]

  const result = schema.safeParse(data)
  if (result.success) return {}

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "_form")
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}
