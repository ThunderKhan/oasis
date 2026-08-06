"use client"

import { Info, ShieldCheck } from "lucide-react"
import { ChoiceCard } from "@/components/ui/ChoiceCard"
import { ConsentNotice } from "@/components/ui/ConsentNotice"
import { FormField } from "@/components/ui/FormField"
import { cn } from "@/lib/utils"
import type { PatientInput, SexAtBirth } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface PatientStepProps {
  value: PatientInput
  errors: FieldErrors
  onChange: (patch: Partial<PatientInput>) => void
}

export function PatientStep({ value, errors, onChange }: PatientStepProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-start gap-3 rounded-lg border border-clinical-blue/30 bg-clinical-blue-soft p-4">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clinical-blue" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">Protect patient privacy</p>
          <p className="text-sm leading-relaxed text-foreground">
            Use a non-identifying patient code. Do not enter a name, Aadhaar number, phone number, or address.
          </p>
        </div>
      </div>

      <section aria-labelledby="patient-identification-heading" className="flex flex-col gap-4">
        <header>
          <h3 id="patient-identification-heading" className="text-base font-semibold text-foreground">
            Patient identification
          </h3>
          <p className="mt-1 text-sm text-muted">Use the code assigned by your facility.</p>
        </header>
        <FormField
          label="Patient code"
          required
          hint="Editable. It must not contain a real name or government identifier."
          error={errors.patient_code}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              value={value.patient_code}
              maxLength={64}
              placeholder="e.g. OASIS-2026-001"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              onChange={(event) => onChange({ patient_code: event.target.value })}
              className={cn(
                "min-h-12 w-full rounded-lg border bg-surface px-3 text-base text-foreground outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                invalid ? "border-urgency-referral" : "border-border-strong",
              )}
            />
          )}
        </FormField>
      </section>

      <section aria-labelledby="demographics-heading" className="flex flex-col gap-4">
        <header>
          <h3 id="demographics-heading" className="text-base font-semibold text-foreground">Demographics</h3>
          <p className="mt-1 text-sm text-muted">These details determine screening eligibility and applicable pathways.</p>
        </header>
        <FormField
          label="Age in years"
          required
          hint="Enter a whole number from 0 to 120."
          error={errors.age}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="number"
              inputMode="numeric"
              value={value.age}
              min={0}
              max={120}
              step={1}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              onChange={(event) => {
                const parsed = Number(event.target.value)
                onChange({ age: Number.isFinite(parsed) ? parsed : 0 })
              }}
              className={cn(
                "min-h-14 w-full max-w-48 rounded-lg border bg-surface px-3 text-lg font-semibold tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                invalid ? "border-urgency-referral" : "border-border-strong",
              )}
            />
          )}
        </FormField>

        <ChoiceCard<SexAtBirth>
          legend="Sex at birth"
          required
          value={value.sex_at_birth}
          onChange={(sexAtBirth) => onChange({ sex_at_birth: sexAtBirth })}
          error={errors.sex_at_birth}
          hint="Choose the option documented in the clinical record."
          choices={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
            { value: "intersex", label: "Intersex" },
            { value: "unknown", label: "Unknown / not recorded" },
          ]}
        />
      </section>

      <section aria-labelledby="consent-heading" className="flex flex-col gap-3">
        <h3 id="consent-heading" className="text-base font-semibold text-foreground">Consent confirmation</h3>
        <ConsentNotice
          checked={value.consent_given}
          onChange={(consentGiven) => onChange({ consent_given: consentGiven })}
          error={errors.consent_given}
        />
      </section>

      <details className="group rounded-lg border border-border bg-background p-4">
        <summary className="flex min-h-6 cursor-pointer items-center gap-2 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Info aria-hidden="true" className="size-4 text-primary" />
          Why we ask
        </summary>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-6 text-sm leading-relaxed text-muted">
          <li>Age influences screening eligibility.</li>
          <li>Sex at birth determines which pathways may apply.</li>
          <li>Consent protects patient autonomy and privacy.</li>
        </ul>
      </details>
    </div>
  )
}
