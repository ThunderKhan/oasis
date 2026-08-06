"use client"

import { motion, useReducedMotion } from "framer-motion"
import { LockKeyhole } from "lucide-react"
import { StepIndicator } from "@/components/assessment/StepIndicator"
import { cn } from "@/lib/utils"

export interface AssessmentStep {
  id: string
  label: string
  help: string
}

interface StepNavigationProps {
  steps: AssessmentStep[]
  currentIndex: number
  furthestIndex: number
  onSelect: (index: number) => void
  disabled?: boolean
}

export function StepNavigation({
  steps,
  currentIndex,
  furthestIndex,
  onSelect,
  disabled = false,
}: StepNavigationProps) {
  const reduceMotion = useReducedMotion()
  const progress = steps.length > 1 ? (furthestIndex / (steps.length - 1)) * 100 : 0

  return (
    <nav aria-label="Assessment steps" className="rounded-xl border border-border bg-surface p-3">
      <div className="px-2 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Assessment progress</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>

      <ol className="relative flex flex-col">
        <span aria-hidden="true" className="absolute bottom-7 left-6 top-7 w-px bg-border-strong" />
        <motion.span
          aria-hidden="true"
          className="absolute left-6 top-7 w-px origin-top bg-primary"
          initial={false}
          animate={{ height: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        />

        {steps.map((step, index) => {
          const completed = index < furthestIndex
          const current = index === currentIndex
          const reachable = index <= furthestIndex && !disabled

          return (
            <motion.li
              key={step.id}
              layout={!reduceMotion}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onSelect(index)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 text-left outline-none transition-[min-height,padding,background-color] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  current ? "min-h-20 bg-primary-soft py-3" : "min-h-16 py-2",
                  reachable && !current && "hover:bg-background",
                  !reachable && "cursor-not-allowed opacity-55",
                )}
              >
                <StepIndicator index={index} completed={completed} current={current} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={cn("text-sm font-semibold", current ? "text-primary" : "text-foreground")}> 
                    {step.label}
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {completed ? "Completed" : current ? step.help : "Complete prior step"}
                  </span>
                </span>
                {!reachable ? <LockKeyhole aria-hidden="true" className="size-3.5 shrink-0 text-subtle" /> : null}
              </button>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

export function MobileStepProgress({ steps, currentIndex }: { steps: AssessmentStep[]; currentIndex: number }) {
  const percent = ((currentIndex + 1) / steps.length) * 100

  return (
    <div
      className="rounded-xl border border-border bg-surface px-4 py-3"
      aria-label={`Step ${currentIndex + 1} of ${steps.length}: ${steps[currentIndex]?.label}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{steps[currentIndex]?.label}</p>
          <p className="text-xs text-muted">
            Step {currentIndex + 1} of {steps.length}
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">{Math.round(percent)}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: reduceMotionSafeDuration(), ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

function reduceMotionSafeDuration() {
  if (typeof window === "undefined") return 0.2
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.2
}
