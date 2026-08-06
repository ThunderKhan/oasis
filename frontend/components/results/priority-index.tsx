"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPriorityConfig, SCORE_CAVEAT, SCORE_LABEL } from "@/lib/priority-config"
import type { UrgencyCategory } from "@/lib/assessment-types"

interface PriorityIndexProps {
  score: number
  priority: UrgencyCategory
  className?: string
  /** Show the mandatory "not a probability" caveat inline */
  showCaveat?: boolean
}

/**
 * Screening Priority Index display. Never presented as cancer probability;
 * the caveat is shown by default and the label is fixed.
 */
export function PriorityIndex({ score, priority, className, showCaveat = true }: PriorityIndexProps) {
  const config = getPriorityConfig(priority)
  const reduceMotion = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, score))

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{SCORE_LABEL}</span>
        <span className={cn("text-sm font-semibold tabular-nums", config.textClass)}>
          {clamped}
          <span className="font-normal text-subtle"> / 100</span>
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={SCORE_LABEL}
        className="h-2 overflow-hidden rounded-full bg-border"
      >
        <motion.div
          className={cn("h-full rounded-full", config.solidClass)}
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showCaveat && (
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {SCORE_CAVEAT}
        </p>
      )}
    </div>
  )
}
