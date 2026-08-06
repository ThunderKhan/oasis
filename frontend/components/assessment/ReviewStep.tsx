"use client"

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AssessmentInput } from "@/lib/assessment-types"

interface ReviewStepProps {
  input: AssessmentInput
  onEdit: (stepIndex: number) => void
}

interface ReviewCardProps {
  title: string
  stepIndex: number
  applicable?: boolean
  screening: string
  exposures?: string[]
  symptoms: string[]
  redFlagCount: number
  history?: string[]
  highRiskHistoryCount?: number
  researchStatus?: string
  onEdit: (stepIndex: number) => void
}

function readableList(items: string[], emptyLabel: string) {
  return items.length > 0 ? items.join(", ") : emptyLabel
}

function researchCompletion(input: AssessmentInput["cervical"]) {
  const values = [
    input.number_of_sexual_partners,
    input.first_sexual_intercourse_age,
    input.number_of_pregnancies,
    input.smoking_current,
    input.smoking_years,
    input.hormonal_contraceptive_years,
    input.iud_years,
    input.std_history,
    input.std_diagnoses_count,
  ]

  const answered = values.filter((value) => value !== null).length

  if (answered === 0) return "Not completed (optional)"
  if (answered === values.length) return "Completed"
  return "Partially completed (optional)"
}

function ReviewCard({
  title,
  stepIndex,
  applicable = true,
  screening,
  exposures = [],
  symptoms,
  redFlagCount,
  history = [],
  highRiskHistoryCount,
  researchStatus,
  onEdit,
}: ReviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex min-w-0 flex-col gap-2">
          <CardTitle className="text-base">{title}</CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              {applicable ? "Complete" : "Not included"}
            </span>

            {redFlagCount > 0 && applicable && (
              <span className="flex items-center gap-1.5 rounded-full bg-urgency-referral-soft px-2.5 py-1 text-xs font-semibold text-urgency-referral">
                <AlertTriangle aria-hidden="true" className="size-3.5" />
                {redFlagCount} red-flag{" "}
                {redFlagCount === 1 ? "finding" : "findings"}
              </span>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(stepIndex)}
        >
          <Pencil data-icon="inline-start" aria-hidden="true" />
          Edit section
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <dl className="divide-y divide-border text-sm">
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
            <dt className="text-muted">Screening history</dt>
            <dd className="font-medium text-foreground">
              {applicable ? screening : "Pathway not included"}
            </dd>
          </div>

          {exposures.length > 0 && applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Active exposures</dt>
              <dd className="font-medium text-foreground">
                {readableList(exposures, "None reported")}
              </dd>
            </div>
          )}

          {applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Reported symptoms</dt>
              <dd className="font-medium text-foreground">
                {readableList(symptoms, "None reported")}
              </dd>
            </div>
          )}

          {applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Red-flag count</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {redFlagCount}
              </dd>
            </div>
          )}

          {highRiskHistoryCount !== undefined && applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">High-risk history count</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {highRiskHistoryCount}
              </dd>
            </div>
          )}

          {highRiskHistoryCount !== undefined && applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">High-risk history details</dt>
              <dd className="font-medium text-foreground">
                {readableList(history, "None reported")}
              </dd>
            </div>
          )}

          {researchStatus && applicable && (
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Research-model fields</dt>
              <dd className="font-medium text-foreground">{researchStatus}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}

export function ReviewStep({ input, onEdit }: ReviewStepProps) {
  const { patient, oral, breast, cervical } = input

  const oralExposures = [
    oral.smoking_current && "Current smoked-tobacco use",
    oral.smokeless_tobacco_current && "Current smokeless-tobacco use",
    oral.areca_nut_current && "Current areca-nut or betel-quid use",
    oral.alcohol_high_exposure && "High alcohol exposure",
  ].filter(Boolean) as string[]

  const oralSymptoms = [
    oral.non_healing_ulcer && "Non-healing mouth ulcer",
    oral.white_patch && "Persistent white patch",
    oral.red_patch && "Persistent red patch",
    oral.oral_growth && "Oral growth or lump",
    oral.unexplained_bleeding && "Unexplained oral bleeding",
    oral.restricted_mouth_opening && "Restricted mouth opening",
    oral.difficulty_swallowing && "Difficulty swallowing",
    oral.neck_lump && "Neck lump",
    oral.abnormal_exam && "Abnormal oral examination",
  ].filter(Boolean) as string[]

  const breastSymptoms = [
    breast.new_breast_lump && "New breast lump",
    breast.axillary_lump && "Axillary lump",
    breast.bloody_nipple_discharge && "Bloody nipple discharge",
    breast.new_nipple_inversion && "New nipple inversion",
    breast.skin_dimpling_or_peau_dorange && "Skin dimpling or peau d’orange",
    breast.breast_ulceration && "Breast ulceration",
    breast.abnormal_cbe && "Abnormal clinical breast examination",
  ].filter(Boolean) as string[]

  const breastHistory = [
    breast.previous_breast_cancer && "Previous breast cancer",
    breast.known_pathogenic_variant && "Known pathogenic genetic variant",
    breast.previous_chest_radiation && "Previous chest radiation",
    breast.atypical_hyperplasia_or_lcis && "Atypical hyperplasia or LCIS",
    breast.first_degree_relatives > 0 &&
      `${breast.first_degree_relatives} first-degree relative${
        breast.first_degree_relatives === 1 ? "" : "s"
      }`,
    breast.relative_diagnosed_before_50 && "Relative diagnosed before age 50",
  ].filter(Boolean) as string[]

  const cervicalSymptoms = [
    cervical.postcoital_bleeding && "Postcoital bleeding",
    cervical.postmenopausal_bleeding && "Postmenopausal bleeding",
    cervical.unexplained_persistent_bleeding &&
      "Persistent unexplained bleeding",
    cervical.persistent_foul_discharge && "Persistent foul-smelling discharge",
    cervical.pelvic_pain && "Pelvic pain",
    cervical.abnormal_cervical_exam && "Abnormal cervical examination",
  ].filter(Boolean) as string[]

  const cervicalHistory = [
    cervical.living_with_hiv && "Living with HIV",
    cervical.previous_positive_hpv && "Previous positive HPV result",
    cervical.previous_abnormal_via_or_cytology &&
      "Previous abnormal VIA or cytology result",
  ].filter(Boolean) as string[]

  const applicablePathways = [
    "Oral",
    breast.applicable && "Breast",
    cervical.applicable && "Cervical",
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex flex-col gap-5">
      <section
        className="rounded-xl border border-border bg-background p-4"
        aria-labelledby="review-assessment-title"
      >
        <div className="flex items-start gap-3">
          <ClipboardCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <h3
              id="review-assessment-title"
              className="text-base font-semibold text-foreground"
            >
              Review Assessment
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              Verify the complete assessment before continuing to submission.
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Patient code</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {patient.patient_code}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Age</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {patient.age} years
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Applicable pathways</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {applicablePathways}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Completion status</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              Ready for review
            </dd>
          </div>
        </dl>
      </section>

      <ReviewCard
        title="Oral"
        stepIndex={1}
        screening={
          oral.screened_before
            ? `Previous screening · ${
                oral.years_since_screening ?? "Unknown"
              } years ago`
            : "No previous screening reported"
        }
        exposures={oralExposures.length > 0 ? oralExposures : ["None reported"]}
        symptoms={oralSymptoms}
        redFlagCount={oralSymptoms.length}
        onEdit={onEdit}
      />

      <ReviewCard
        title="Breast"
        stepIndex={2}
        applicable={breast.applicable}
        screening={
          breast.screened_before
            ? `Previous CBE · ${breast.years_since_cbe ?? "Unknown"} years ago`
            : "No previous CBE reported"
        }
        symptoms={breastSymptoms}
        redFlagCount={breastSymptoms.length}
        history={breastHistory}
        highRiskHistoryCount={breastHistory.length}
        onEdit={onEdit}
      />

      <ReviewCard
        title="Cervical"
        stepIndex={3}
        applicable={cervical.applicable}
        screening={
          cervical.screened_before
            ? `Previous screening · ${
                cervical.years_since_screening ?? "Unknown"
              } years ago`
            : "No previous screening reported"
        }
        symptoms={cervicalSymptoms}
        redFlagCount={cervicalSymptoms.length}
        history={cervicalHistory}
        highRiskHistoryCount={cervicalHistory.length}
        researchStatus={researchCompletion(cervical)}
        onEdit={onEdit}
      />
    </div>
  )
}
