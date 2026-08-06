"use client"

import { AlertOctagon, CheckCircle2, Pencil, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"
import type { AssessmentInput } from "@/lib/assessment-types"

interface ReviewStepProps {
  input: AssessmentInput
  onEdit: (stepIndex: number) => void
}

interface ReviewRow {
  label: string
  value: string
  redFlag?: boolean
}

function yn(value: boolean | null): string {
  if (value === null) return "Unknown"
  return value ? "Yes" : "No"
}

function num(value: number | null, suffix = ""): string {
  return value === null ? "Not provided" : `${value}${suffix}`
}

function countTrue(values: (boolean | null)[]): number {
  return values.filter((value) => value === true).length
}

function ReviewCard({
  title,
  stepIndex,
  rows,
  redFlagCount,
  historyLabel,
  historyCount,
  skipped = false,
  onEdit,
}: {
  title: string
  stepIndex: number
  rows: ReviewRow[]
  redFlagCount?: number
  historyLabel?: string
  historyCount?: number
  skipped?: boolean
  onEdit: (stepIndex: number) => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex min-w-0 flex-col gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-muted">
            {skipped ? (
              <span className="flex items-center gap-1.5">
                <SkipForward aria-hidden="true" className="size-3.5" />
                Pathway skipped
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 aria-hidden="true" className="size-3.5 text-primary" />
                Ready for review
              </span>
            )}
            {redFlagCount !== undefined && !skipped && (
              <span className={redFlagCount > 0 ? "text-urgency-referral" : undefined}>
                {redFlagCount} red flag{redFlagCount === 1 ? "" : "s"}
              </span>
            )}
            {historyLabel && historyCount !== undefined && !skipped && (
              <span>
                {historyCount} {historyLabel}
              </span>
            )}
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(stepIndex)}>
          <Pencil data-icon="inline-start" aria-hidden="true" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
              <dt className="flex min-w-0 items-start gap-1.5 text-muted">
                {row.redFlag && (
                  <AlertOctagon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-urgency-referral" />
                )}
                <span>{row.label}</span>
                {row.redFlag && <span className="sr-only">(red-flag symptom reported)</span>}
              </dt>
              <dd
                className={
                  row.redFlag
                    ? "max-w-[55%] text-right font-semibold text-urgency-referral"
                    : "max-w-[55%] text-right font-medium text-foreground"
                }
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

export function ReviewStep({ input, onEdit }: ReviewStepProps) {
  const { patient, oral, breast, cervical } = input

  const oralFlags: ReviewRow[] = [
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
  const breastFlags: ReviewRow[] = [
    { label: "New breast lump", value: yn(breast.new_breast_lump), redFlag: breast.new_breast_lump },
    { label: "Axillary lump", value: yn(breast.axillary_lump), redFlag: breast.axillary_lump },
    { label: "Bloody nipple discharge", value: yn(breast.bloody_nipple_discharge), redFlag: breast.bloody_nipple_discharge },
    { label: "New nipple inversion", value: yn(breast.new_nipple_inversion), redFlag: breast.new_nipple_inversion },
    { label: "Skin dimpling / peau d’orange", value: yn(breast.skin_dimpling_or_peau_dorange), redFlag: breast.skin_dimpling_or_peau_dorange },
    { label: "Breast ulceration", value: yn(breast.breast_ulceration), redFlag: breast.breast_ulceration },
    { label: "Abnormal CBE today", value: yn(breast.abnormal_cbe), redFlag: breast.abnormal_cbe },
  ]
  const cervicalFlags: ReviewRow[] = [
    { label: "Postcoital bleeding", value: yn(cervical.postcoital_bleeding), redFlag: cervical.postcoital_bleeding },
    { label: "Postmenopausal bleeding", value: yn(cervical.postmenopausal_bleeding), redFlag: cervical.postmenopausal_bleeding },
    { label: "Unexplained persistent bleeding", value: yn(cervical.unexplained_persistent_bleeding), redFlag: cervical.unexplained_persistent_bleeding },
    { label: "Persistent foul discharge", value: yn(cervical.persistent_foul_discharge), redFlag: cervical.persistent_foul_discharge },
    { label: "Pelvic pain", value: yn(cervical.pelvic_pain), redFlag: cervical.pelvic_pain },
    { label: "Abnormal cervical exam", value: yn(cervical.abnormal_cervical_exam), redFlag: cervical.abnormal_cervical_exam },
  ]

  const oralRedFlagCount = oralFlags.filter((row) => row.redFlag).length
  const breastRedFlagCount = breastFlags.filter((row) => row.redFlag).length
  const cervicalRedFlagCount = cervicalFlags.filter((row) => row.redFlag).length
  const totalRedFlags = oralRedFlagCount + (breast.applicable ? breastRedFlagCount : 0) + (cervical.applicable ? cervicalRedFlagCount : 0)
  const oralExposureCount = countTrue([
    oral.smoking_current,
    oral.smokeless_tobacco_current,
    oral.areca_nut_current,
    oral.alcohol_high_exposure,
  ])
  const breastHistoryCount = countTrue([
    breast.previous_breast_cancer,
    breast.known_pathogenic_variant,
    breast.previous_chest_radiation,
    breast.atypical_hyperplasia_or_lcis,
    breast.first_degree_relatives > 0,
  ])
  const cervicalHistoryCount = countTrue([
    cervical.living_with_hiv,
    cervical.previous_positive_hpv,
    cervical.previous_abnormal_via_or_cytology,
  ])

  return (
    <div className="flex flex-col gap-4">
      {totalRedFlags > 0 && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-3.5">
          <AlertOctagon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-urgency-referral" />
          <p className="text-sm font-medium leading-relaxed text-urgency-referral">
            One or more red-flag symptoms were reported. Review the highlighted items below before submitting.
          </p>
        </div>
      )}

      <ReviewCard
        title="Patient"
        stepIndex={0}
        onEdit={onEdit}
        rows={[
          { label: "Patient code", value: patient.patient_code || "Not provided" },
          { label: "Age", value: `${patient.age} years` },
          {
            label: "Sex at birth",
            value: patient.sex_at_birth === "unknown" ? "Unknown / not recorded" : patient.sex_at_birth.charAt(0).toUpperCase() + patient.sex_at_birth.slice(1),
          },
          { label: "Verbal consent", value: yn(patient.consent_given) },
        ]}
      />

      <ReviewCard
        title="Oral"
        stepIndex={1}
        onEdit={onEdit}
        redFlagCount={oralRedFlagCount}
        historyLabel="current exposure(s)"
        historyCount={oralExposureCount}
        rows={[
          { label: "Screening status", value: oral.screened_before ? `Screened before · ${num(oral.years_since_screening, " yr ago")}` : "Not screened before" },
          { label: "Exposure duration", value: `${oral.exposure_years} yr` },
          ...oralFlags,
        ]}
      />

      <ReviewCard
        title="Breast"
        stepIndex={2}
        onEdit={onEdit}
        skipped={!breast.applicable}
        redFlagCount={breastRedFlagCount}
        historyLabel="high-risk history item(s)"
        historyCount={breastHistoryCount}
        rows={
          breast.applicable
            ? [
                { label: "Screening status", value: breast.screened_before ? `CBE before · ${num(breast.years_since_cbe, " yr ago")}` : "No previous CBE" },
                ...breastFlags,
                { label: "First-degree relatives", value: String(breast.first_degree_relatives) },
              ]
            : [{ label: "Applicability", value: "No — pathway skipped" }]
        }
      />

      <ReviewCard
        title="Cervical"
        stepIndex={3}
        onEdit={onEdit}
        skipped={!cervical.applicable}
        redFlagCount={cervicalRedFlagCount}
        historyLabel="relevant history item(s)"
        historyCount={cervicalHistoryCount}
        rows={
          cervical.applicable
            ? [
                { label: "Screening status", value: cervical.screened_before ? `Screened before · ${num(cervical.years_since_screening, " yr ago")}` : "Not screened before" },
                ...cervicalFlags,
                { label: "Living with HIV", value: yn(cervical.living_with_hiv) },
                { label: "Previous positive HPV", value: yn(cervical.previous_positive_hpv) },
                { label: "Previous abnormal VIA / cytology", value: yn(cervical.previous_abnormal_via_or_cytology) },
              ]
            : [{ label: "Applicability", value: "No — pathway skipped" }]
        }
      />

      <p className="rounded-lg border border-border bg-background p-3.5 text-xs leading-relaxed text-muted">
        {SYSTEM_DISCLAIMER} Submitting sends this de-identified data to the assessment service for priority classification.
      </p>
    </div>
  )
}
