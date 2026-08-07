"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AlertOctagon, FlaskConical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriorityBadge } from "@/components/results/PriorityBadge"
import { PriorityIndex } from "@/components/results/PriorityIndex"
import { ReasonList } from "@/components/results/ReasonList"
import { RecommendedAction } from "@/components/results/RecommendedAction"
import { ExplanationPanel } from "@/components/results/ExplanationPanel"
import { CANCER_TYPE_LABELS, getPriorityConfig } from "@/lib/priority-config"
import type { CancerAssessment } from "@/lib/assessment-types"
import { cn } from "@/lib/utils"

export function CancerResultCard({ result, index = 0 }: { result: CancerAssessment; index?: number }) {
  const reduceMotion = useReducedMotion()
  const config = getPriorityConfig(result.priority)
  const label = CANCER_TYPE_LABELS[result.cancer_type] ?? result.cancer_type

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.12 + index * 0.08, duration: 0.35 }}
    >
      <Card className={cn("overflow-hidden border", config.borderClasses)}>
        <CardHeader className="border-b border-border pb-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
            <PriorityBadge priority={result.priority} />
            <CardTitle className="text-lg">{label} cancer pathway</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <PriorityIndex score={result.priority_score} priority={result.priority} showCaveat={false} />

          {result.red_flags.length > 0 && (
            <section role="alert" className="flex flex-col gap-2 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-urgency-referral">
                <AlertOctagon aria-hidden="true" className="size-4" /> Red-flag findings
              </p>
              <ul className="flex flex-col gap-1 pl-5 text-sm leading-relaxed text-foreground">
                {result.red_flags.map((flag) => <li key={flag} className="list-disc">{flag}</li>)}
              </ul>
            </section>
          )}

          <RecommendedAction action={result.recommended_action} priority={result.priority} screeningDue={result.screening_due} />

          <div className="flex flex-col gap-1 rounded-lg border border-border bg-background px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span className="text-muted">Screening-due status</span>
            <span className="font-medium text-foreground sm:text-right">{result.screening_due ? "Screening due" : "Not currently due by the configured interval"}</span>
          </div>

          <section className="flex flex-col gap-3" aria-labelledby={`reasons-${result.cancer_type}`}>
            <h4 id={`reasons-${result.cancer_type}`} className="text-sm font-semibold text-foreground">Why this recommendation was generated</h4>
            <ReasonList reasons={result.reasons} />
          </section>

          {result.experimental_model_probability !== null && (
            <section className="flex items-start gap-3 rounded-lg border border-dashed border-border-strong p-4">
              <FlaskConical aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Experimental history-model output: <span className="tabular-nums">{(result.experimental_model_probability * 100).toFixed(1)}%</span></p>
                <p className="text-xs leading-relaxed text-muted">Not externally validated for diagnosis or individual reassurance.</p>
              </div>
            </section>
          )}

          <section className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Limitations</h4>
            {result.limitations.length ? (
              <ul className="flex flex-col gap-1 pl-5 text-sm leading-relaxed text-muted">
                {result.limitations.map((item) => <li key={item} className="list-disc">{item}</li>)}
              </ul>
            ) : <p className="text-sm text-muted">This output remains decision support and is not a diagnosis.</p>}
          </section>

          <ExplanationPanel result={result} />
        </CardContent>
      </Card>
    </motion.article>
  )
}
