"use client"

import { ShieldCheck } from "lucide-react"
import {
  CheckboxField,
  FieldGroup,
  NumberField,
  RadioCardField,
  TextField,
} from "@/components/forms/fields"
import type { PatientInput } from "@/lib/assessment-types"
import type { FieldErrors } from "@/lib/validation"

interface PatientStepProps {
  value: PatientInput
  errors: FieldErrors
  onChange: (patch: Partial<PatientInput>) => void
}

export function PatientStep({ value, errors, onChange }: PatientStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2.5 rounded-lg border border-clinical-blue/30 bg-clinical-blue-soft p-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clinical-blue" />
        <p className="text-xs leading-relaxed text-foreground">
          Do not enter names, Aadhaar numbers, phone numbers, or addresses. Use only the
          facility-assigned patient code so the assessment stays de-identified.
        </p>
      </div>

      <FieldGroup title="Identification" description="De-identified code assigned by your facility.">
        <TextField
          label="Patient code"
          required
          value={value.patient_code}
          onChange={(patientCode) => onChange({ patient_code: patientCode })}
          error={errors.patient_code}
          placeholder="e.g. OASIS-2026-A4F2"
          hint="A non-identifying code is generated for a blank assessment. You can replace it with your facility code."
          maxLength={64}
        />
      </FieldGroup>

      <FieldGroup title="Demographics">
        <NumberField
          label="Age (years)"
          required
          value={value.age === 0 ? null : value.age}
          onChange={(age) => onChange({ age: age ?? 0 })}
          error={errors.age}
          min={0}
          max={120}
        />
        <RadioCardField
          label="Sex at birth"
          required
          value={value.sex_at_birth}
          onChange={(sexAtBirth) => onChange({ sex_at_birth: sexAtBirth })}
          error={errors.sex_at_birth}
          hint="Determines which screening pathways apply."
          options={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
            { value: "intersex", label: "Intersex" },
            { value: "unknown", label: "Unknown / not recorded" },
          ]}
        />
      </FieldGroup>

      <FieldGroup title="Consent">
        <CheckboxField
          label="The patient has given verbal consent for this screening assessment."
          checked={value.consent_given}
          onChange={(consentGiven) => onChange({ consent_given: consentGiven })}
          error={errors.consent_given}
          hint="Consent is required before any assessment data is recorded."
        />
      </FieldGroup>
    </div>
  )
}
