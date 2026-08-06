"use client"

import { AlertOctagon, ArrowRight, FlaskConical, Info, Minus, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriorityBadge } from "@/components/results/priority-badge"
import { PriorityIndex } from "@/components/results/priority-index"
import { CANCER_TYPE_LABELS, getPriorityConfig } from "@/lib/priority-config"
import type { PathwayResult } from "@/lib/assessment-types"
import { cn } from "@/lib/utils"

interface PathwayResultCardProps {
  result: PathwayResult
}

export function PathwayResultCard({ result }: PathwayResultCardProps) {
  const config = getPriorityConfig(result.priority)
  const label = CANCER_TYPE_LABELS[result.cancer_type] ?? result.cancer_type

  return (
    <Card className={cn("border", config.borderClass)}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg">{label} pathway</CardTitle>
          <PriorityBadge priority={result.priority} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <PriorityIndex score={result.priority_score} priority={result.priority} showCaveat={false} />

        {result.red_flags.length > 0 && (
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-3.5"
          >
            <p className="flex items-center gap-1.5 text-sm font-semibold text-urgency-referral">
              <AlertOctagon aria-hidden="true" className="size-4 shrink-0" />
              Red-flag findings
            </p>
            <ul className="flex flex-col gap-1 pl-6 text-sm leading-relaxed text-urgency-referral">
              {result.red_flags.map((flag) => (
                <li key={flag} className="list-disc">
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-1.5 rounded-lg bg-primary-soft p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <ArrowRight aria-hidden="true" className="size-3.5" />
            Recommended action
          </p>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {result.recommended_action}
          </p>
          {result.screening_due && (
            <p className="text-xs text-muted">Screening is currently due on this pathway.</p>
          )}
        </div>

        {result.reasons.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Why this priority
            </h4>
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {result.reasons.map((reason, i) => {
                const increases = reason.effect.toLowerCase().includes("increase")
                const decreases = reason.effect.toLowerCase().includes("decrease")
                return (
                  <li key={`${reason.factor}-${i}`} className="flex items-start gap-2.5 px-3.5 py-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                        increases && "bg-urgency-priority-soft text-urgency-priority",
                        decreases && "bg-urgency-routine-soft text-urgency-routine",
                        !increases && !decreases && "bg-primary-soft text-primary",
                      )}
                    >
                      {increases ? <Plus className="size-3" /> : decreases ? <Minus className="size-3" /> : <Info className="size-3" />}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-foreground">{reason.factor}</span>
                      <span className="text-xs leading-relaxed text-muted">{reason.effect}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {result.experimental_model_probability !== null && (
          <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-border-strong p-3.5">
            <FlaskConical aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">
                Experimental model output:{" "}
                <span className="tabular-nums">
                  {(result.experimental_model_probability * 100).toFixed(1)}%
                </span>
              </p>
              <p className="text-xs leading-relaxed text-muted">
                Research-stage estimate from model {result.model_version}. Not validated for
                clinical use and not a diagnosis.
              </p>
            </div>
          </div>
        )}

        {result.limitations.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-muted">
              Limitations of this assessment
            </summary>
            <ul className="mt-2 flex flex-col gap-1 pl-5 text-xs leading-relaxed text-muted">
              {result.limitations.map((item) => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
