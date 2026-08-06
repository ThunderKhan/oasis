"use client"

import { FieldGroup, NumberField, YesNoField } from "@/components/forms/fields"
import type { OralInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface OralStepProps {
  value: OralInput
  errors: FieldErrors
  onChange: (patch: Partial<OralInput>) => void
}

export function OralStep({ value, errors, onChange }: OralStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup title="Screening history">
        <YesNoField
          label="Has the patient had an oral cancer screening before?"
          value={value.screened_before}
          onChange={(v) =>
            onChange({ screened_before: v, years_since_screening: v ? value.years_since_screening : null })
          }
        />
        {value.screened_before && (
          <NumberField
            label="Years since last oral screening"
            required
            value={value.years_since_screening}
            onChange={(v) => onChange({ years_since_screening: v })}
            error={errors.years_since_screening}
            min={0}
            max={80}
          />
        )}
      </FieldGroup>

      <FieldGroup
        title="Risk exposures"
        description="Current habits. Exposure years covers the longest-running habit."
      >
        <YesNoField
          label="Currently smokes tobacco (cigarettes, bidis)"
          value={value.smoking_current}
          onChange={(v) => onChange({ smoking_current: v })}
        />
        <YesNoField
          label="Currently uses smokeless tobacco (gutkha, khaini, zarda)"
          value={value.smokeless_tobacco_current}
          onChange={(v) => onChange({ smokeless_tobacco_current: v })}
        />
        <YesNoField
          label="Currently chews areca nut / betel quid (supari, paan)"
          value={value.areca_nut_current}
          onChange={(v) => onChange({ areca_nut_current: v })}
        />
        <YesNoField
          label="High alcohol consumption"
          value={value.alcohol_high_exposure}
          onChange={(v) => onChange({ alcohol_high_exposure: v })}
        />
        <NumberField
          label="Total years of exposure"
          required
          value={value.exposure_years}
          onChange={(v) => onChange({ exposure_years: v ?? 0 })}
          error={errors.exposure_years}
          min={0}
          max={90}
          emptyAsZero
          hint="Enter 0 if the patient has no tobacco, areca nut, or alcohol exposure."
        />
      </FieldGroup>

      <FieldGroup
        title="Symptoms and findings"
        description="Red-flag symptoms are marked and must be examined carefully."
      >
        <YesNoField
          redFlag
          label="Mouth ulcer that has not healed for more than 3 weeks"
          value={value.non_healing_ulcer}
          onChange={(v) => onChange({ non_healing_ulcer: v })}
        />
        <YesNoField
          redFlag
          label="White patch in the mouth (leukoplakia)"
          value={value.white_patch}
          onChange={(v) => onChange({ white_patch: v })}
        />
        <YesNoField
          redFlag
          label="Red patch in the mouth (erythroplakia)"
          value={value.red_patch}
          onChange={(v) => onChange({ red_patch: v })}
        />
        <YesNoField
          redFlag
          label="Growth, lump, or thickening inside the mouth"
          value={value.oral_growth}
          onChange={(v) => onChange({ oral_growth: v })}
        />
        <YesNoField
          redFlag
          label="Unexplained bleeding in the mouth"
          value={value.unexplained_bleeding}
          onChange={(v) => onChange({ unexplained_bleeding: v })}
        />
        <YesNoField
          redFlag
          label="Restricted mouth opening (trismus)"
          value={value.restricted_mouth_opening}
          onChange={(v) => onChange({ restricted_mouth_opening: v })}
        />
        <YesNoField
          redFlag
          label="Difficulty swallowing"
          value={value.difficulty_swallowing}
          onChange={(v) => onChange({ difficulty_swallowing: v })}
        />
        <YesNoField
          redFlag
          label="Lump in the neck"
          value={value.neck_lump}
          onChange={(v) => onChange({ neck_lump: v })}
        />
        <YesNoField
          redFlag
          label="Abnormal finding on visual oral examination today"
          value={value.abnormal_exam}
          onChange={(v) => onChange({ abnormal_exam: v })}
        />
      </FieldGroup>
    </div>
  )
}
