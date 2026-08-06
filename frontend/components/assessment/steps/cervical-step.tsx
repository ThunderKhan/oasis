"use client"

import { FieldGroup, NumberField, YesNoField } from "@/components/forms/fields"
import type { CervicalInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface CervicalStepProps {
  value: CervicalInput
  errors: FieldErrors
  onChange: (patch: Partial<CervicalInput>) => void
}

export function CervicalStep({ value, errors, onChange }: CervicalStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup title="Pathway applicability">
        <YesNoField
          label="Is the cervical pathway applicable for this patient?"
          hint="Applicable for patients with a cervix, regardless of gender identity."
          value={value.applicable}
          onChange={(v) => onChange({ applicable: v })}
        />
      </FieldGroup>

      {value.applicable && (
        <>
          <FieldGroup title="Screening history">
            <YesNoField
              label="Has the patient had cervical screening (VIA, Pap, or HPV test) before?"
              value={value.screened_before}
              onChange={(v) =>
                onChange({
                  screened_before: v,
                  years_since_screening: v ? value.years_since_screening : null,
                })
              }
            />
            {value.screened_before && (
              <NumberField
                label="Years since last cervical screening"
                required
                value={value.years_since_screening}
                onChange={(v) => onChange({ years_since_screening: v })}
                error={errors.years_since_screening}
                min={0}
                max={80}
              />
            )}
            <YesNoField
              label="Previous positive HPV test"
              value={value.previous_positive_hpv}
              onChange={(v) => onChange({ previous_positive_hpv: v })}
            />
            <YesNoField
              label="Previous abnormal VIA or cytology result"
              value={value.previous_abnormal_via_or_cytology}
              onChange={(v) => onChange({ previous_abnormal_via_or_cytology: v })}
            />
            <YesNoField
              label="Is the patient living with HIV?"
              value={value.living_with_hiv}
              onChange={(v) => onChange({ living_with_hiv: v })}
              allowUnknown
              onUnknown={() => onChange({ living_with_hiv: null })}
              hint="HIV status changes the recommended screening interval. Select Unknown if not known."
            />
          </FieldGroup>

          <FieldGroup
            title="Symptoms and findings"
            description="Red-flag symptoms are marked and must be examined carefully."
          >
            <YesNoField
              redFlag
              label="Bleeding after intercourse (postcoital bleeding)"
              value={value.postcoital_bleeding}
              onChange={(v) => onChange({ postcoital_bleeding: v })}
            />
            <YesNoField
              redFlag
              label="Bleeding after menopause"
              value={value.postmenopausal_bleeding}
              onChange={(v) => onChange({ postmenopausal_bleeding: v })}
            />
            <YesNoField
              redFlag
              label="Unexplained persistent vaginal bleeding"
              value={value.unexplained_persistent_bleeding}
              onChange={(v) => onChange({ unexplained_persistent_bleeding: v })}
            />
            <YesNoField
              redFlag
              label="Persistent foul-smelling vaginal discharge"
              value={value.persistent_foul_discharge}
              onChange={(v) => onChange({ persistent_foul_discharge: v })}
            />
            <YesNoField
              redFlag
              label="Persistent pelvic pain"
              value={value.pelvic_pain}
              onChange={(v) => onChange({ pelvic_pain: v })}
            />
            <YesNoField
              redFlag
              label="Abnormal cervical appearance on speculum exam today"
              value={value.abnormal_cervical_exam}
              onChange={(v) => onChange({ abnormal_cervical_exam: v })}
            />
          </FieldGroup>

          <details className="group rounded-lg border border-border bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <span>Additional research-model variables</span>
              <span
                aria-hidden="true"
                className="text-muted transition-transform duration-200 group-open:rotate-180"
              >
                ▾
              </span>
            </summary>

            <div className="border-t border-border p-4">
              <p className="mb-4 text-xs leading-relaxed text-muted">
                These fields support an experimental research model. They are optional,
                sensitive, and must only be collected with appropriate consent and privacy
                safeguards.
              </p>

              <FieldGroup
                title="Optional research information"
                description="Leave any field blank when the information is unknown or has not been collected."
              >
                <NumberField
                  label="Number of sexual partners"
                  value={value.number_of_sexual_partners}
                  onChange={(v) => onChange({ number_of_sexual_partners: v })}
                  error={errors.number_of_sexual_partners}
                  min={0}
                  max={200}
                />
                <NumberField
                  label="Age at first sexual intercourse"
                  value={value.first_sexual_intercourse_age}
                  onChange={(v) => onChange({ first_sexual_intercourse_age: v })}
                  error={errors.first_sexual_intercourse_age}
                  min={5}
                  max={80}
                />
                <NumberField
                  label="Number of pregnancies"
                  value={value.number_of_pregnancies}
                  onChange={(v) => onChange({ number_of_pregnancies: v })}
                  error={errors.number_of_pregnancies}
                  min={0}
                  max={30}
                />
                <YesNoField
                  label="Currently smokes tobacco"
                  value={value.smoking_current}
                  onChange={(v) =>
                    onChange({
                      smoking_current: v,
                      smoking_years: v ? value.smoking_years : null,
                    })
                  }
                  allowUnknown
                  onUnknown={() => onChange({ smoking_current: null, smoking_years: null })}
                />
                {value.smoking_current === true && (
                  <NumberField
                    label="Years of smoking"
                    value={value.smoking_years}
                    onChange={(v) => onChange({ smoking_years: v })}
                    error={errors.smoking_years}
                    min={0}
                    max={90}
                  />
                )}
                <NumberField
                  label="Years of hormonal contraceptive use"
                  value={value.hormonal_contraceptive_years}
                  onChange={(v) => onChange({ hormonal_contraceptive_years: v })}
                  error={errors.hormonal_contraceptive_years}
                  min={0}
                  max={60}
                />
                <NumberField
                  label="Years of IUD use"
                  value={value.iud_years}
                  onChange={(v) => onChange({ iud_years: v })}
                  error={errors.iud_years}
                  min={0}
                  max={60}
                />
                <YesNoField
                  label="History of sexually transmitted disease"
                  value={value.std_history}
                  onChange={(v) =>
                    onChange({
                      std_history: v,
                      std_diagnoses_count: v ? value.std_diagnoses_count : null,
                    })
                  }
                  allowUnknown
                  onUnknown={() =>
                    onChange({ std_history: null, std_diagnoses_count: null })
                  }
                />
                {value.std_history === true && (
                  <NumberField
                    label="Number of STD diagnoses"
                    value={value.std_diagnoses_count}
                    onChange={(v) => onChange({ std_diagnoses_count: v })}
                    error={errors.std_diagnoses_count}
                    min={0}
                    max={50}
                  />
                )}
              </FieldGroup>
            </div>
          </details>
        </>
      )}

      {!value.applicable && (
        <p className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
          The cervical pathway will be skipped for this patient. You can change this at any time
          before submitting.
        </p>
      )}
    </div>
  )
}