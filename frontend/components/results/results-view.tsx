"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Check, Clipboard, ClipboardList, Download, History, Printer, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CancerResultCard } from "@/components/results/CancerResultCard"
import { PriorityBadge } from "@/components/results/PriorityBadge"
import { ResultDisclaimer } from "@/components/results/ResultDisclaimer"
import { ReferralSummary } from "@/components/referrals/ReferralSummary"
import { useAssessmentStore } from "@/stores/assessment-store"
import {
  loadSavedResult,
  loadSavedResultTimestamp,
  clearSavedResult,
  clearSavedAssessment,
} from "@/lib/session-persistence"
import { getPriorityConfig, PRIORITY_ORDER, SCORE_CAVEAT } from "@/lib/priority-config"
import type { AssessmentResponse, CancerAssessment } from "@/lib/assessment-types"

export function ResultsView() {
  const { result, setResult, reset } = useAssessmentStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!result) {
      const saved = loadSavedResult()
      if (saved) setResult(saved)
    }
    setHydrated(true)
  }, [result, setResult])

  if (!hydrated) return <div className="h-64 animate-pulse rounded-card border border-border bg-surface" aria-label="Loading assessment results" />

  if (!result) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-card border border-border bg-surface px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary"><ClipboardList aria-hidden="true" className="size-6" /></span>
        <h1 className="text-xl font-semibold tracking-tight">No results yet</h1>
        <p className="leading-relaxed text-muted">Results appear here after an assessment is submitted. They are kept only for this browser session.</p>
        <Link href="/assessment" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Start assessment</Link>
      </div>
    )
  }

  return <ResultsContent result={result} onNewAssessment={() => { reset(); clearSavedResult(); clearSavedAssessment() }} />
}

function ResultsContent({ result, onNewAssessment }: { result: AssessmentResponse; onNewAssessment: () => void }) {
  const assessment = useAssessmentStore((state) => state.assessment)
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const overall = getPriorityConfig(result.overall_priority)
  const pathways = useMemo(() => Object.values(result.results).filter((item): item is CancerAssessment => Boolean(item)).sort((a, b) => PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority)), [result.results])
  useEffect(() => {
    setCompletedAt(loadSavedResultTimestamp())
  }, [result.assessment_id])

  const completed = completedAt ? new Date(completedAt) : null

  async function copyAssessmentId() {
    try {
      await navigator.clipboard.writeText(result.assessment_id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }

  return (
    <>
      <div className="results-screen flex flex-col gap-6 pb-20 print:hidden md:pb-0">
        <motion.section
          className={`overflow-hidden rounded-card border bg-surface ${overall.borderClasses}`}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-labelledby="screening-recommendation"
        >
          <div className="flex flex-col gap-5 p-5 md:p-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Decision-support result</p>
                <h1 id="screening-recommendation" className="text-balance text-3xl font-semibold tracking-tight">Screening Recommendation</h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                  <span>Assessment <strong className="font-medium text-foreground">{result.assessment_id}</strong></span>
                  <span>Patient <strong className="font-medium text-foreground">{result.patient_code}</strong></span>
                  <span>{completed ? completed.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Completion time not recorded"}</span>
                </div>
              </div>
              <PriorityBadge priority={result.overall_priority} size="lg" />
            </div>
            <div className={`rounded-lg p-4 ${overall.backgroundClasses}`}>
              <p className={`text-lg font-semibold ${overall.textClasses}`}>{overall.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">{overall.description}</p>
            </div>
            <p className="border-l-2 border-primary pl-4 text-sm font-medium leading-relaxed text-foreground">{SCORE_CAVEAT}</p>
          </div>
        </motion.section>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => window.print()}><Printer aria-hidden="true" />Print Referral Summary</Button>
          <Button variant="outline" onClick={copyAssessmentId}>{copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}{copied ? "Assessment ID copied" : "Copy Assessment ID"}</Button>
          <Link href="/assessment" onClick={onNewAssessment} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-muted hover:bg-primary-soft hover:text-primary"><RotateCcw aria-hidden="true" className="size-4" />Start New Assessment</Link>
          <Link href="/referrals" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-muted hover:bg-primary-soft hover:text-primary"><History aria-hidden="true" className="size-4" />View Assessment History</Link>
          <Button variant="ghost" disabled title="PDF download is not yet implemented"><Download aria-hidden="true" />Download later</Button>
        </div>

        <section className="flex flex-col gap-4" aria-labelledby="pathway-heading">
          <div><h2 id="pathway-heading" className="text-xl font-semibold">Pathway recommendations</h2><p className="mt-1 text-sm text-muted">Ordered by clinical urgency.</p></div>
          {pathways.map((pathway, index) => <CancerResultCard key={pathway.cancer_type} result={pathway} index={index} />)}
        </section>
        <ResultDisclaimer disclaimer={result.disclaimer} />
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface p-3 print:hidden md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <Button className="flex-1" onClick={() => window.print()}><Printer aria-hidden="true" />Print summary</Button>
          <Button variant="outline" onClick={copyAssessmentId} aria-label="Copy assessment ID">{copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}</Button>
        </div>
      </div>

      <ReferralSummary result={result} input={assessment} completedAt={completedAt} />
    </>
  )
}
