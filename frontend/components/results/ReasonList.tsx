"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUp, Info } from "lucide-react"
import type { Reason } from "@/lib/assessment-types"

export function ReasonList({ reasons }: { reasons: Reason[] }) {
  const reduceMotion = useReducedMotion()

  if (!reasons.length) return <p className="text-sm text-muted">No additional recommendation factors were recorded.</p>

  return (
    <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {reasons.map((reason, index) => {
        const increases = reason.effect.toLowerCase().includes("increase")
        const decreases = reason.effect.toLowerCase().includes("decrease")
        const Icon = increases ? ArrowUp : decreases ? ArrowDown : Info
        return (
          <motion.li
            key={`${reason.factor}-${index}`}
            className="flex items-start gap-3 p-3"
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
          >
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon aria-hidden="true" className="size-3.5" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{reason.factor}</span>
              <span className="text-xs leading-relaxed text-muted">{reason.effect}</span>
            </span>
          </motion.li>
        )
      })}
    </ul>
  )
}
