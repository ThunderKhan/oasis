"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardList, Printer, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner"
import { PriorityBadge } from "@/components/results/priority-badge"
import { PathwayResultCard } from "@/components/results/pathway-result-card"
import { useAssessmentStore } from "@/stores/assessment-store"
import { loadSavedResult, clearSavedResult, clearSavedAssessment } from "@/lib/session-persistence"
import { getPriorityConfig, PRIORITY_ORDER, SCORE_CAVEAT } from "@/lib/priority-config"
import type { AssessmentResponse, CancerType, PathwayResult } from "@/lib/assessment-types"

const PATHWAY_ORDER: CancerType[] = ["oral", "breast", "cervical"]

export function ResultsView() {
  const { result, setResult, reset } = useAssessmentStore()
  const [hydrated, setHydrated] = useState(false)

  // Restore the latest result from sessionStorage after a refresh.
  useEffect(() => {
    if (!result) {
      const saved = loadSavedResult()
      if (saved) setResult(saved)
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!hydrated) return null

  if (!result) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <ClipboardList aria-hidden="true" className="size-6" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight">No results yet</h2>
        <p className="leading-relaxed text-muted">
          Results appear here after an assessment is submitted. Results are kept only for this
          browser session.
        </p>
        <Link
          href="/assessment"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Start a new assessment
        </Link>
      </div>
    )
  }

  return <ResultsContent result={result} onNewAssessment={() => {
    reset()
    clearSavedResult()
    clearSavedAssessment()
  }} />
}

function ResultsContent({
  result,
  onNewAssessment,
}: {
  result: AssessmentResponse
  onNewAssessment: () => void
}) {
  const overall = getPriorityConfig(result.overall_priority)
  const pathways = PATHWAY_ORDER.map((type) => result.results[type]).filter(
    (r): r is PathwayResult => Boolean(r),
  )

  // Most urgent first for display.
  const sorted = [...pathways].sort(
    (a, b) => PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority),
  )

  const printedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Print-only referral header */}
      <div className="hidden print:block">
        <div className="border-b border-border pb-4">
          <h1 className="text-xl font-semibold">O.A.S.I.S. Screening Referral Summary</h1>
          <p className="mt-1 text-sm text-muted">
            Patient code: <span className="font-medium text-foreground">{result.patient_code}</span>
            {" · "}Assessment ID: {result.assessment_id}
            {" · "}Printed: {printedAt}
          </p>
        </div>
      </div>

      {/* Overall priority summary */}
      <section
        aria-labelledby="overall-heading"
        className={`flex flex-col gap-3 rounded-card border p-5 ${overall.borderClass} ${overall.bgClass}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id="overall-heading" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Overall priority — patient {result.patient_code}
            </h2>
            <p className={`text-xl font-semibold ${overall.textClass}`}>{overall.label}</p>
          </div>
          <PriorityBadge priority={result.overall_priority} size="lg" />
        </div>
        <p className="text-sm leading-relaxed text-foreground">{overall.description}</p>
        <p className="text-xs leading-relaxed text-muted">{SCORE_CAVEAT}</p>
      </section>

      <DisclaimerBanner text={result.disclaimer} />

      {/* Actions — hidden when printing */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden="true" className="size-4" />
          Print referral summary
        </Button>
        <Link
          href="/assessment"
          onClick={onNewAssessment}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-primary"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          New assessment
        </Link>
      </div>

      {/* Per-pathway results, most urgent first */}
      <div className="flex flex-col gap-4">
        {sorted.map((pathway) => (
          <PathwayResultCard key={pathway.cancer_type} result={pathway} />
        ))}
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block">
        <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted">
          {result.disclaimer} A low Screening Priority Index does not rule cancer out. This summary
          contains no patient-identifying information; match the patient code against facility
          records.
        </p>
      </div>
    </div>
  )
}
