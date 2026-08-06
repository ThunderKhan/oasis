"use client"

import { ConditionalField } from "@/components/assessment/ConditionalField"
import { QuestionGroup } from "@/components/assessment/QuestionGroup"
import { QuestionToggle } from "@/components/assessment/QuestionToggle"
import { NumberField } from "@/components/forms/fields"
import type { OralInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

type ExposureField =
  | "smoking_current"
  | "smokeless_tobacco_current"
  | "areca_nut_current"
  | "alcohol_high_exposure"

type WarningField =
  | "non_healing_ulcer"
  | "white_patch"
  | "red_patch"
  | "oral_growth"
  | "unexplained_bleeding"
  | "restricted_mouth_opening"
  | "difficulty_swallowing"
  | "neck_lump"
  | "abnormal_exam"

const EXPOSURES: { field: ExposureField; label: string; description?: string }[] = [
  { field: "smoking_current", label: "Current smoked-tobacco use", description: "Includes cigarettes and bidis." },
  { field: "smokeless_tobacco_current", label: "Current smokeless-tobacco use", description: "Includes gutkha, khaini, and zarda." },
  { field: "areca_nut_current", label: "Current areca-nut, supari, or betel-quid use", description: "Includes supari and paan with or without tobacco." },
  { field: "alcohol_high_exposure", label: "High alcohol exposure" },
]

const WARNING_SIGNS: { field: WarningField; label: string; description?: string }[] = [
  { field: "non_healing_ulcer", label: "Non-healing mouth ulcer", description: "An ulcer present for more than three weeks." },
  { field: "white_patch", label: "Persistent white patch" },
  { field: "red_patch", label: "Persistent red patch" },
  { field: "oral_growth", label: "Oral growth or lump" },
  { field: "unexplained_bleeding", label: "Unexplained oral bleeding" },
  { field: "restricted_mouth_opening", label: "Restricted mouth opening" },
  { field: "difficulty_swallowing", label: "Difficulty swallowing" },
  { field: "neck_lump", label: "Neck lump" },
  { field: "abnormal_exam", label: "Abnormal oral examination" },
]

interface OralStepProps {
  value: OralInput
  errors: FieldErrors
  onChange: (patch: Partial<OralInput>) => void
}

export function OralStep({ value, errors, onChange }: OralStepProps) {
  const exposureCount = EXPOSURES.filter(({ field }) => value[field]).length
  const warningCount = WARNING_SIGNS.filter(({ field }) => value[field]).length
  const hasActiveExposure = exposureCount > 0

  const updateExposure = (field: ExposureField, nextValue: boolean) => {
    const nextExposureCount = EXPOSURES.filter(({ field: candidate }) =>
      candidate === field ? nextValue : value[candidate],
    ).length

    onChange({
      [field]: nextValue,
      ...(nextExposureCount === 0 ? { exposure_years: 0 } : {}),
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <QuestionGroup
        section="A"
        title="Screening history"
        description="Record whether oral screening has previously been completed."
      >
        <QuestionToggle
          label="Has the patient previously received oral screening?"
          value={value.screened_before}
          onChange={(screenedBefore) =>
            onChange({
              screened_before: screenedBefore,
              years_since_screening: screenedBefore ? value.years_since_screening : null,
            })
          }
        />
        <ConditionalField show={value.screened_before}>
          <NumberField
            label="How many years since the previous screening?"
            required
            value={value.years_since_screening}
            onChange={(years) => onChange({ years_since_screening: years })}
            error={errors.years_since_screening}
            min={0}
            max={80}
            inputClassName="max-w-48"
          />
        </ConditionalField>
      </QuestionGroup>

      <QuestionGroup
        section="B"
        title="Exposure history"
        description="Record current exposures. Do not infer an absent exposure when history is uncertain."
      >
        {EXPOSURES.map(({ field, label, description }) => (
          <QuestionToggle
            key={field}
            label={label}
            description={description}
            value={value[field]}
            onChange={(nextValue) => updateExposure(field, nextValue)}
          />
        ))}
        <ConditionalField show={hasActiveExposure}>
          <NumberField
            label="Total exposure duration in years"
            required
            value={value.exposure_years}
            onChange={(years) => onChange({ exposure_years: years ?? 0 })}
            error={errors.exposure_years}
            min={0}
            max={100}
            emptyAsZero
            inputClassName="max-w-48"
            hint="Enter the total duration of the longest-running active exposure, from 0 to 100 years."
          />
        </ConditionalField>
      </QuestionGroup>

      <QuestionGroup
        section="C"
        title="Symptoms and examination findings"
        description="Select Yes for every symptom or examination finding currently reported or observed."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {WARNING_SIGNS.map(({ field, label, description }) => (
            <QuestionToggle
              key={field}
              label={label}
              description={description}
              value={value[field]}
              onChange={(nextValue) => onChange({ [field]: nextValue })}
              redFlag
              compact
            />
          ))}
        </div>
      </QuestionGroup>

      <section aria-labelledby="oral-summary-title" className="rounded-lg border border-border bg-background p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 id="oral-summary-title" className="text-sm font-semibold text-foreground">
              Current section summary
            </h3>
            <p className="text-xs leading-relaxed text-muted">Non-diagnostic summary of answers entered on this step.</p>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Exposures</dt>
              <dd className="mt-1 font-semibold tabular-nums text-foreground">{exposureCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Warning signs</dt>
              <dd className="mt-1 font-semibold tabular-nums text-foreground">{warningCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Prior screening</dt>
              <dd className="mt-1 font-semibold text-foreground">{value.screened_before ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
