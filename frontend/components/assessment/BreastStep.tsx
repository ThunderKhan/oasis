"use client"

import { Info, ShieldCheck } from "lucide-react"
import { ConditionalField } from "@/components/assessment/ConditionalField"
import { QuestionGroup } from "@/components/assessment/QuestionGroup"
import { QuestionToggle } from "@/components/assessment/QuestionToggle"
import { NumberField } from "@/components/forms/fields"
import type { BreastInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface BreastStepProps {
  value: BreastInput
  errors: FieldErrors
  onChange: (patch: Partial<BreastInput>) => void
}

const SYMPTOMS = [
  ["new_breast_lump", "New breast lump"],
  ["axillary_lump", "Axillary lump"],
  ["bloody_nipple_discharge", "Bloody nipple discharge"],
  ["new_nipple_inversion", "New nipple inversion"],
  ["skin_dimpling_or_peau_dorange", "Skin dimpling or peau d’orange"],
  ["breast_ulceration", "Breast ulceration"],
  ["abnormal_cbe", "Abnormal clinical breast examination"],
] as const

export function BreastStep({ value, errors, onChange }: BreastStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="breast-applicability-title" className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 flex items-start gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <h3 id="breast-applicability-title" className="text-sm font-semibold text-foreground">
              Pathway applicability
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              Include this pathway based on the clinical context and the patient’s anatomy and history.
            </p>
          </div>
        </div>
        <QuestionToggle
          label="Include breast screening pathway in this assessment"
          description="A healthcare worker may revise this selection before submission."
          value={value.applicable}
          onChange={(applicable) => onChange({ applicable })}
        />
      </section>

      <ConditionalField show={value.applicable}>
        <div className="flex flex-col gap-8">
          <QuestionGroup section="A" title="Screening history" description="Record previous clinical breast examination history.">
            <QuestionToggle
              label="Previous clinical breast examination"
              value={value.screened_before}
              onChange={(screenedBefore) =>
                onChange({
                  screened_before: screenedBefore,
                  years_since_cbe: screenedBefore ? value.years_since_cbe : null,
                })
              }
            />
            <ConditionalField show={value.screened_before}>
              <NumberField
                label="Years since previous CBE"
                required
                value={value.years_since_cbe}
                onChange={(yearsSinceCbe) => onChange({ years_since_cbe: yearsSinceCbe })}
                error={errors.years_since_cbe}
                min={0}
                max={80}
                inputClassName="max-w-48"
              />
            </ConditionalField>
          </QuestionGroup>

          <QuestionGroup
            section="B"
            title="Current symptoms and examination findings"
            description="Select Yes for every symptom reported or finding observed."
          >
            <div className="grid gap-3 lg:grid-cols-2">
              {SYMPTOMS.map(([field, label]) => (
                <QuestionToggle
                  key={field}
                  label={label}
                  value={value[field]}
                  onChange={(nextValue) => onChange({ [field]: nextValue })}
                  redFlag
                  compact
                />
              ))}
            </div>
          </QuestionGroup>

          <QuestionGroup
            section="C"
            title="High-risk personal and family history"
            description="Record only known diagnoses and reported history; do not infer genetic risk."
          >
            <QuestionToggle
              label="Previous breast cancer"
              value={value.previous_breast_cancer}
              onChange={(nextValue) => onChange({ previous_breast_cancer: nextValue })}
            />
            <QuestionToggle
              label="Known pathogenic genetic variant"
              description="Select Yes only when a pathogenic variant has been diagnosed or documented."
              value={value.known_pathogenic_variant}
              onChange={(nextValue) => onChange({ known_pathogenic_variant: nextValue })}
            />
            <QuestionToggle
              label="Previous chest radiation"
              value={value.previous_chest_radiation}
              onChange={(nextValue) => onChange({ previous_chest_radiation: nextValue })}
            />
            <QuestionToggle
              label="Atypical hyperplasia or LCIS"
              value={value.atypical_hyperplasia_or_lcis}
              onChange={(nextValue) => onChange({ atypical_hyperplasia_or_lcis: nextValue })}
            />
            <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2">
              <NumberField
                label="Number of first-degree relatives with breast cancer"
                required
                value={value.first_degree_relatives}
                onChange={(count) => onChange({ first_degree_relatives: count ?? 0 })}
                error={errors.first_degree_relatives}
                min={0}
                max={20}
                emptyAsZero
                inputClassName="max-w-48"
                hint="Includes parents, siblings, and children. Enter 0 if none are reported."
              />
              <ConditionalField show={value.first_degree_relatives > 0}>
                <QuestionToggle
                  label="Relative diagnosed before age 50"
                  value={value.relative_diagnosed_before_50}
                  onChange={(nextValue) => onChange({ relative_diagnosed_before_50: nextValue })}
                />
              </ConditionalField>
            </div>
          </QuestionGroup>

          <aside className="flex items-start gap-3 rounded-lg border border-border bg-primary-soft p-4">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              High-risk history may require specialist assessment rather than routine population screening.
            </p>
          </aside>
        </div>
      </ConditionalField>

      {!value.applicable && (
        <p className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
          Breast pathway questions are currently collapsed. This selection does not determine medical relevance and should be reviewed using clinical judgement.
        </p>
      )}
    </div>
  )
}
