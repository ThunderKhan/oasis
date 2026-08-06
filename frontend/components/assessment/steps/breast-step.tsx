"use client"

import { FieldGroup, NumberField, YesNoField } from "@/components/forms/fields"
import type { BreastInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface BreastStepProps {
  value: BreastInput
  errors: FieldErrors
  onChange: (patch: Partial<BreastInput>) => void
}

export function BreastStep({ value, errors, onChange }: BreastStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup title="Pathway applicability">
        <YesNoField
          label="Is the breast pathway applicable for this patient?"
          hint="Applicable for patients with breast tissue, regardless of gender identity."
          value={value.applicable}
          onChange={(v) => onChange({ applicable: v })}
        />
      </FieldGroup>

      {value.applicable && (
        <>
          <FieldGroup title="Screening history">
            <YesNoField
              label="Has the patient had a clinical breast exam (CBE) before?"
              value={value.screened_before}
              onChange={(v) =>
                onChange({ screened_before: v, years_since_cbe: v ? value.years_since_cbe : null })
              }
            />
            {value.screened_before && (
              <NumberField
                label="Years since last clinical breast exam"
                required
                value={value.years_since_cbe}
                onChange={(v) => onChange({ years_since_cbe: v })}
                error={errors.years_since_cbe}
                min={0}
                max={80}
              />
            )}
          </FieldGroup>

          <FieldGroup
            title="Symptoms and findings"
            description="Red-flag symptoms are marked and must be examined carefully."
          >
            <YesNoField
              redFlag
              label="New breast lump"
              value={value.new_breast_lump}
              onChange={(v) => onChange({ new_breast_lump: v })}
            />
            <YesNoField
              redFlag
              label="Lump in the armpit (axilla)"
              value={value.axillary_lump}
              onChange={(v) => onChange({ axillary_lump: v })}
            />
            <YesNoField
              redFlag
              label="Bloody nipple discharge"
              value={value.bloody_nipple_discharge}
              onChange={(v) => onChange({ bloody_nipple_discharge: v })}
            />
            <YesNoField
              redFlag
              label="New nipple inversion (turning inward)"
              value={value.new_nipple_inversion}
              onChange={(v) => onChange({ new_nipple_inversion: v })}
            />
            <YesNoField
              redFlag
              label="Skin dimpling or orange-peel texture (peau d'orange)"
              value={value.skin_dimpling_or_peau_dorange}
              onChange={(v) => onChange({ skin_dimpling_or_peau_dorange: v })}
            />
            <YesNoField
              redFlag
              label="Ulceration of the breast skin"
              value={value.breast_ulceration}
              onChange={(v) => onChange({ breast_ulceration: v })}
            />
            <YesNoField
              redFlag
              label="Abnormal clinical breast exam today"
              value={value.abnormal_cbe}
              onChange={(v) => onChange({ abnormal_cbe: v })}
            />
          </FieldGroup>

          <FieldGroup title="Personal and family history">
            <YesNoField
              label="Previous breast cancer diagnosis"
              value={value.previous_breast_cancer}
              onChange={(v) => onChange({ previous_breast_cancer: v })}
            />
            <YesNoField
              label="Known pathogenic variant (e.g. BRCA1/BRCA2)"
              value={value.known_pathogenic_variant}
              onChange={(v) => onChange({ known_pathogenic_variant: v })}
            />
            <YesNoField
              label="Previous radiation therapy to the chest"
              value={value.previous_chest_radiation}
              onChange={(v) => onChange({ previous_chest_radiation: v })}
            />
            <YesNoField
              label="Atypical hyperplasia or LCIS on previous biopsy"
              value={value.atypical_hyperplasia_or_lcis}
              onChange={(v) => onChange({ atypical_hyperplasia_or_lcis: v })}
            />
            <NumberField
              label="First-degree relatives with breast cancer"
              required
              value={value.first_degree_relatives}
              onChange={(v) => onChange({ first_degree_relatives: v ?? 0 })}
              error={errors.first_degree_relatives}
              min={0}
              max={20}
              emptyAsZero
              hint="Mother, sisters, daughters. Enter 0 if none."
            />
            {value.first_degree_relatives > 0 && (
              <YesNoField
                label="Any relative diagnosed before age 50"
                value={value.relative_diagnosed_before_50}
                onChange={(v) => onChange({ relative_diagnosed_before_50: v })}
              />
            )}
          </FieldGroup>
        </>
      )}

      {!value.applicable && (
        <p className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
          The breast pathway will be skipped for this patient. You can change this at any time
          before submitting.
        </p>
      )}
    </div>
  )
}
