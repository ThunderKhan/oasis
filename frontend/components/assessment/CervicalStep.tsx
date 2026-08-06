"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown, ShieldCheck } from "lucide-react"
import { ConditionalField } from "@/components/assessment/ConditionalField"
import { QuestionGroup } from "@/components/assessment/QuestionGroup"
import { QuestionToggle } from "@/components/assessment/QuestionToggle"
import { NumberField, YesNoField } from "@/components/forms/fields"
import type { CervicalInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"
import { cn } from "@/lib/utils"

interface CervicalStepProps {
  value: CervicalInput
  errors: FieldErrors
  onChange: (patch: Partial<CervicalInput>) => void
}

const SYMPTOMS = [
  ["postcoital_bleeding", "Postcoital bleeding"],
  ["postmenopausal_bleeding", "Postmenopausal bleeding"],
  ["unexplained_persistent_bleeding", "Persistent unexplained bleeding"],
  ["persistent_foul_discharge", "Persistent foul-smelling discharge"],
  ["pelvic_pain", "Pelvic pain"],
  ["abnormal_cervical_exam", "Abnormal cervical examination"],
] as const

export function CervicalStep({ value, errors, onChange }: CervicalStepProps) {
  const [researchOpen, setResearchOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-col gap-8">
      <aside className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">Consent and confidentiality</p>
          <p className="text-sm leading-relaxed text-muted">
            These questions support screening prioritisation. Collect responses only with consent and handle them confidentially.
          </p>
        </div>
      </aside>

      <section aria-labelledby="cervical-applicability-title" className="rounded-xl border border-border bg-surface p-4">
        <h3 id="cervical-applicability-title" className="mb-3 text-sm font-semibold text-foreground">
          Pathway applicability
        </h3>
        <QuestionToggle
          label="Include cervical screening pathway in this assessment"
          description="Base this selection on clinical context and the patient’s anatomy and history."
          value={value.applicable}
          onChange={(applicable) => onChange({ applicable })}
        />
      </section>

      <ConditionalField show={value.applicable}>
        <div className="flex flex-col gap-8">
          <QuestionGroup section="A" title="Core screening" description="Record previous screening and clinically relevant history.">
            <QuestionToggle
              label="Previous cervical screening"
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
                label="Years since previous cervical screening"
                required
                value={value.years_since_screening}
                onChange={(years) => onChange({ years_since_screening: years })}
                error={errors.years_since_screening}
                min={0}
                max={80}
                inputClassName="max-w-48"
              />
            </ConditionalField>
            <YesNoField
              label="Living with HIV"
              value={value.living_with_hiv}
              onChange={(nextValue) => onChange({ living_with_hiv: nextValue })}
              allowUnknown
              onUnknown={() => onChange({ living_with_hiv: null })}
              hint="Select Unknown when HIV status has not been collected or is not known."
            />
            <QuestionToggle
              label="Previous positive HPV result"
              value={value.previous_positive_hpv}
              onChange={(nextValue) => onChange({ previous_positive_hpv: nextValue })}
            />
            <QuestionToggle
              label="Previous abnormal VIA or cytology result"
              value={value.previous_abnormal_via_or_cytology}
              onChange={(nextValue) => onChange({ previous_abnormal_via_or_cytology: nextValue })}
            />
          </QuestionGroup>

          <QuestionGroup
            section="B"
            title="Symptoms and examination"
            description="A selected symptom may require prompt clinical evaluation."
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

          <section className="overflow-hidden rounded-xl border border-border bg-surface">
            <button
              type="button"
              aria-expanded={researchOpen}
              aria-controls="cervical-research-fields"
              onClick={() => setResearchOpen((open) => !open)}
              className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left text-sm font-semibold text-foreground outline-none transition-colors hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span>Additional research-model variables</span>
              <ChevronDown
                aria-hidden="true"
                className={cn("size-5 shrink-0 text-muted transition-transform", researchOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {researchOpen && (
                <motion.div
                  id="cervical-research-fields"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-5 border-t border-border p-4">
                    <aside className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
                      These fields support an experimental research model. They are optional, sensitive, and must not be used without appropriate consent and privacy safeguards.
                    </aside>
                    <p className="text-xs leading-relaxed text-muted">
                      Leave any field blank when it was not collected or the patient chose not to answer.
                    </p>
                    <div className="grid gap-5 md:grid-cols-2">
                      <NumberField label="Number of sexual partners" value={value.number_of_sexual_partners} onChange={(nextValue) => onChange({ number_of_sexual_partners: nextValue })} error={errors.number_of_sexual_partners} min={0} max={200} />
                      <NumberField label="Age at first sexual intercourse" value={value.first_sexual_intercourse_age} onChange={(nextValue) => onChange({ first_sexual_intercourse_age: nextValue })} error={errors.first_sexual_intercourse_age} min={5} max={80} />
                      <NumberField label="Number of pregnancies" value={value.number_of_pregnancies} onChange={(nextValue) => onChange({ number_of_pregnancies: nextValue })} error={errors.number_of_pregnancies} min={0} max={30} />
                      <YesNoField label="Current smoking" value={value.smoking_current} onChange={(nextValue) => onChange({ smoking_current: nextValue, smoking_years: nextValue ? value.smoking_years : null })} allowUnknown onUnknown={() => onChange({ smoking_current: null, smoking_years: null })} />
                      {value.smoking_current === true && <NumberField label="Smoking duration" hint="Years" value={value.smoking_years} onChange={(nextValue) => onChange({ smoking_years: nextValue })} error={errors.smoking_years} min={0} max={90} />}
                      <NumberField label="Hormonal contraceptive duration" hint="Years" value={value.hormonal_contraceptive_years} onChange={(nextValue) => onChange({ hormonal_contraceptive_years: nextValue })} error={errors.hormonal_contraceptive_years} min={0} max={60} />
                      <NumberField label="IUD duration" hint="Years" value={value.iud_years} onChange={(nextValue) => onChange({ iud_years: nextValue })} error={errors.iud_years} min={0} max={60} />
                      <YesNoField label="History of sexually transmitted infection" value={value.std_history} onChange={(nextValue) => onChange({ std_history: nextValue, std_diagnoses_count: nextValue ? value.std_diagnoses_count : null })} allowUnknown onUnknown={() => onChange({ std_history: null, std_diagnoses_count: null })} />
                      {value.std_history === true && <NumberField label="Number of STI diagnoses" value={value.std_diagnoses_count} onChange={(nextValue) => onChange({ std_diagnoses_count: nextValue })} error={errors.std_diagnoses_count} min={0} max={50} />}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </ConditionalField>

      {!value.applicable && (
        <p className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
          Cervical pathway questions are currently collapsed. This selection does not determine medical relevance and should be reviewed using clinical judgement.
        </p>
      )}
    </div>
  )
}
