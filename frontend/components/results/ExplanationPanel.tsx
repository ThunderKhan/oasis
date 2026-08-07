"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { CancerAssessment } from "@/lib/assessment-types"
import { cn } from "@/lib/utils"

export function ExplanationPanel({ result }: { result: CancerAssessment }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const reduceMotion = useReducedMotion()

  return (
    <div className="rounded-lg border border-border bg-background text-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left font-medium text-muted transition-colors hover:bg-primary-soft hover:text-primary"
      >
        Technical details
        <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 transition-transform motion-reduce:transition-none", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-3 flex flex-col gap-3 border-t border-border py-3">
              <p><span className="font-medium">Model version:</span> {result.model_version}</p>
              {result.reasons.some((reason) => reason.evidence_key) && (
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Evidence keys</p>
                  <ul className="flex flex-col gap-1 text-sm text-muted">
                    {result.reasons.filter((reason) => reason.evidence_key).map((reason) => (
                      <li key={`${reason.factor}-${reason.evidence_key}`}><span className="text-foreground">{reason.factor}:</span> {reason.evidence_key}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
