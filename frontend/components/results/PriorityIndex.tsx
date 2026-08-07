"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  getPriorityConfig,
  PRIORITY_CONFIG,
  PRIORITY_ORDER,
  SCORE_CAVEAT,
} from "@/lib/priority-config"
import type { Priority } from "@/lib/assessment-types"
import { cn } from "@/lib/utils"

interface PriorityIndexProps {
  score: number
  priority: Priority
  showCaveat?: boolean
}

const SEGMENTS = PRIORITY_ORDER.map((priority) => PRIORITY_CONFIG[priority].label)

export function PriorityIndex({ score, priority, showCaveat = true }: PriorityIndexProps) {
  const reduceMotion = useReducedMotion()
  const safeScore = Math.max(0, Math.min(100, score))
  const segmentWidth = 100 / SEGMENTS.length
  const config = getPriorityConfig(priority)

  return (
    <div className="flex flex-col gap-3" aria-label={`Screening Priority Index ${safeScore} out of 100`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Screening Priority Index</p>
          <p className="text-xs text-muted">Urgency for screening or referral</p>
        </div>
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {safeScore}<span className="text-sm font-normal text-muted">/100</span>
        </p>
      </div>

      <div className="grid grid-cols-6 gap-1" aria-hidden="true">
        {SEGMENTS.map((label, index) => {
          const start = index * segmentWidth
          const fill = Math.max(0, Math.min(100, ((safeScore - start) / segmentWidth) * 100))
          return (
            <div key={label} className="h-2 overflow-hidden rounded-sm bg-urgency-routine-soft">
              <motion.div
                className={cn("h-full origin-left", config.solidClass)}
                initial={reduceMotion ? { width: `${fill}%` } : { width: 0 }}
                animate={{ width: `${fill}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-y-1 text-xs leading-relaxed text-muted sm:grid-cols-6">
        {SEGMENTS.map((label, index) => (
          <span key={label} className={cn(index === 5 && "text-right sm:text-left")}>{label}</span>
        ))}
      </div>

      {showCaveat && <p className="text-xs leading-relaxed text-muted">{SCORE_CAVEAT}</p>}
    </div>
  )
}
