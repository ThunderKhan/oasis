"use client"

import { AlertOctagon } from "lucide-react"
import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"
import type { AssessmentInput } from "@/lib/assessment-types"

interface ReviewStepProps {
  input: AssessmentInput
}

interface ReviewRow {
  label: string
  value: string
  redFlag?: boolean
}

function yn(v: boolean | null): string {
  if (v === null) return "Unknown"
  return v ? "Yes" : "No"
}

function num(v: number | null, suffix = ""): string {
  return v === null ? "Not provided" : `${v}${suffix}`
}

function ReviewSection({ title, rows }: { title: string; rows: ReviewRow[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <dl className="divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 px-3.5 py-2.5 text-sm"
          >
            <dt className="flex items-center gap-1.5 text-muted">
              {row.redFlag && (
                <AlertOctagon aria-hidden="true" className="size-3.5 shrink-0 text-urgency-referral" />
              )}
              {row.label}
              {row.redFlag && <span className="sr-only">(red-flag symptom reported)</span>}
            </dt>
            <dd
              className={
                row.redFlag
                  ? "shrink-0 font-semibold text-urgency-referral"
                  : "shrink-0 font-medium text-foreground"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function ReviewStep({ input }: ReviewStepProps) {
  const { patient, oral, breast, cervical } = input

  const oralRedFlags: ReviewRow[] = [
    { label: "Non-healing ulcer (>3 weeks)", value: yn(oral.non_healing_ulcer), redFlag: oral.non_healing_ulcer },
    { label: "White patch", value: yn(oral.white_patch), redFlag: oral.white_patch },
    { label: "Red patch", value: yn(oral.red_patch), redFlag: oral.red_patch },
    { label: "Oral growth or lump", value: yn(oral.oral_growth), redFlag: oral.oral_growth },
    { label: "Unexplained bleeding", value: yn(oral.unexplained_bleeding), redFlag: oral.unexplained_bleeding },
    { label: "Restricted mouth opening", value: yn(oral.restricted_mouth_opening), redFlag: oral.restricted_mouth_opening },
    { label: "Difficulty swallowing", value: yn(oral.difficulty_swallowing), redFlag: oral.difficulty_swallowing },
    { label: "Neck lump", value: yn(oral.neck_lump), redFlag: oral.neck_lump },
    { label: "Abnormal oral exam", value: yn(oral.abnormal_exam), redFlag: oral.abnormal_exam },
  ]

  const anyRedFlag =
    oralRedFlags.some((r) => r.redFlag) ||
    (breast.applicable &&
      (breast.new_breast_lump ||
        breast.axillary_lump ||
        breast.bloody_nipple_discharge ||
        breast.new_nipple_inversion ||
        breast.skin_dimpling_or_peau_dorange ||
        breast.breast_ulceration ||
        breast.abnormal_cbe)) ||
    (cervical.applicable &&
      (cervical.postcoital_bleeding ||
        cervical.postmenopausal_bleeding ||
        cervical.unexplained_persistent_bleeding ||
        cervical.persistent_foul_discharge ||
        cervical.pelvic_pain ||
        cervical.abnormal_cervical_exam))

  return (
    <div className="flex flex-col gap-6">
      {anyRedFlag && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-3.5"
        >
          <AlertOctagon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-urgency-referral" />
          <p className="text-sm font-medium leading-relaxed text-urgency-referral">
            One or more red-flag symptoms were reported. Review the highlighted items below before
            submitting.
          </p>
        </div>
      )}

      <ReviewSection
        title="Patient"
        rows={[
          { label: "Patient code", value: patient.patient_code || "Not provided" },
          { label: "Age", value: `${patient.age} years` },
          {
            label: "Sex at birth",
            value:
              patient.sex_at_birth === "unknown"
                ? "Unknown / not recorded"
                : patient.sex_at_birth.charAt(0).toUpperCase() + patient.sex_at_birth.slice(1),
          },
          { label: "Verbal consent", value: yn(patient.consent_given) },
        ]}
      />

      <ReviewSection
        title="Oral pathway"
        rows={[
          { label: "Screened before", value: yn(oral.screened_before) },
          ...(oral.screened_before
            ? [{ label: "Years since screening", value: num(oral.years_since_screening, " yr") }]
            : []),
          { label: "Current smoking", value: yn(oral.smoking_current) },
          { label: "Smokeless tobacco", value: yn(oral.smokeless_tobacco_current) },
          { label: "Areca nut", value: yn(oral.areca_nut_current) },
          { label: "High alcohol", value: yn(oral.alcohol_high_exposure) },
          { label: "Exposure years", value: `${oral.exposure_years} yr` },
          ...oralRedFlags,
        ]}
      />

      {breast.applicable ? (
        <ReviewSection
          title="Breast pathway"
          rows={[
            { label: "CBE before", value: yn(breast.screened_before) },
            ...(breast.screened_before
              ? [{ label: "Years since CBE", value: num(breast.years_since_cbe, " yr") }]
              : []),
            { label: "New breast lump", value: yn(breast.new_breast_lump), redFlag: breast.new_breast_lump },
            { label: "Axillary lump", value: yn(breast.axillary_lump), redFlag: breast.axillary_lump },
            { label: "Bloody nipple discharge", value: yn(breast.bloody_nipple_discharge), redFlag: breast.bloody_nipple_discharge },
            { label: "New nipple inversion", value: yn(breast.new_nipple_inversion), redFlag: breast.new_nipple_inversion },
            { label: "Skin dimpling / peau d'orange", value: yn(breast.skin_dimpling_or_peau_dorange), redFlag: breast.skin_dimpling_or_peau_dorange },
            { label: "Breast ulceration", value: yn(breast.breast_ulceration), redFlag: breast.breast_ulceration },
            { label: "Abnormal CBE today", value: yn(breast.abnormal_cbe), redFlag: breast.abnormal_cbe },
            { label: "Previous breast cancer", value: yn(breast.previous_breast_cancer) },
            { label: "Known pathogenic variant", value: yn(breast.known_pathogenic_variant) },
            { label: "Previous chest radiation", value: yn(breast.previous_chest_radiation) },
            { label: "Atypical hyperplasia / LCIS", value: yn(breast.atypical_hyperplasia_or_lcis) },
            { label: "First-degree relatives", value: String(breast.first_degree_relatives) },
            ...(breast.first_degree_relatives > 0
              ? [{ label: "Relative diagnosed before 50", value: yn(breast.relative_diagnosed_before_50) }]
              : []),
          ]}
        />
      ) : (
        <ReviewSection
          title="Breast pathway"
          rows={[{ label: "Applicable", value: "No — pathway skipped" }]}
        />
      )}

      {cervical.applicable ? (
        <ReviewSection
          title="Cervical pathway"
          rows={[
            { label: "Screened before", value: yn(cervical.screened_before) },
            ...(cervical.screened_before
              ? [{ label: "Years since screening", value: num(cervical.years_since_screening, " yr") }]
              : []),
            { label: "Living with HIV", value: yn(cervical.living_with_hiv) },
            { label: "Previous positive HPV", value: yn(cervical.previous_positive_hpv) },
            { label: "Previous abnormal VIA / cytology", value: yn(cervical.previous_abnormal_via_or_cytology) },
            { label: "Postcoital bleeding", value: yn(cervical.postcoital_bleeding), redFlag: cervical.postcoital_bleeding },
            { label: "Postmenopausal bleeding", value: yn(cervical.postmenopausal_bleeding), redFlag: cervical.postmenopausal_bleeding },
            { label: "Unexplained persistent bleeding", value: yn(cervical.unexplained_persistent_bleeding), redFlag: cervical.unexplained_persistent_bleeding },
            { label: "Persistent foul discharge", value: yn(cervical.persistent_foul_discharge), redFlag: cervical.persistent_foul_discharge },
            { label: "Pelvic pain", value: yn(cervical.pelvic_pain), redFlag: cervical.pelvic_pain },
            { label: "Abnormal cervical exam", value: yn(cervical.abnormal_cervical_exam), redFlag: cervical.abnormal_cervical_exam },
            { label: "Sexual partners", value: num(cervical.number_of_sexual_partners) },
            { label: "Age at first intercourse", value: num(cervical.first_sexual_intercourse_age) },
            { label: "Pregnancies", value: num(cervical.number_of_pregnancies) },
            { label: "Current smoking", value: yn(cervical.smoking_current) },
            ...(cervical.smoking_current === true
              ? [{ label: "Smoking years", value: num(cervical.smoking_years, " yr") }]
              : []),
            { label: "Hormonal contraceptive years", value: num(cervical.hormonal_contraceptive_years, " yr") },
            { label: "IUD years", value: num(cervical.iud_years, " yr") },
            { label: "STD history", value: yn(cervical.std_history) },
            ...(cervical.std_history === true
              ? [{ label: "STD diagnoses", value: num(cervical.std_diagnoses_count) }]
              : []),
          ]}
        />
      ) : (
        <ReviewSection
          title="Cervical pathway"
          rows={[{ label: "Applicable", value: "No — pathway skipped" }]}
        />
      )}

      <p className="rounded-lg border border-border bg-background p-3.5 text-xs leading-relaxed text-muted">
        {SYSTEM_DISCLAIMER} Submitting sends this de-identified data to the assessment service for
        priority classification.
      </p>
    </div>
  )
}
