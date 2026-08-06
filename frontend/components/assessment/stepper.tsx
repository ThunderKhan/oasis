"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepDefinition {
  id: string
  label: string
}

interface StepperProps {
  steps: StepDefinition[]
  currentIndex: number
  furthestIndex: number
  onStepSelect?: (index: number) => void
  variant?: "vertical" | "compact"
  interactionDisabled?: boolean
}

export function Stepper({
  steps,
  currentIndex,
  furthestIndex,
  onStepSelect,
  variant = "compact",
  interactionDisabled = false,
}: StepperProps) {
  if (variant === "vertical") {
    return (
      <nav aria-label="Assessment progress">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Assessment progress</p>
        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const completed = index < furthestIndex
            const current = index === currentIndex
            const reachable = index <= furthestIndex
            const available = reachable && !interactionDisabled

            return (
              <li key={step.id} className="relative flex min-h-14 items-start">
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-[21px] top-10 h-6 w-px",
                      index < furthestIndex ? "bg-primary" : "bg-border-strong",
                    )}
                  />
                )}
                <button
                  type="button"
                  disabled={!available}
                  onClick={() => available && onStepSelect?.(index)}
                  aria-current={current ? "step" : undefined}
                  aria-label={`${step.label}${completed ? ", completed" : current ? ", current step" : reachable ? ", available" : ", not yet available"}`}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    current && "bg-primary-soft",
                    available && !current && "hover:bg-primary-soft",
                    !available && "cursor-not-allowed opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      completed && "border-primary bg-primary text-primary-foreground",
                      current && "border-primary bg-background text-primary",
                      !completed && !current && "border-border-strong bg-surface text-subtle",
                    )}
                  >
                    {completed ? <Check aria-hidden="true" /> : index + 1}
                  </span>
                  <span className={cn("font-medium", current ? "text-foreground" : "text-muted")}>{step.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  return (
    <nav aria-label="Assessment progress" className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3 md:hidden">
        <p className="text-sm font-semibold text-foreground">{steps[currentIndex]?.label}</p>
        <p className="shrink-0 text-xs font-medium text-muted">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>
      <ol className="grid grid-cols-5 gap-1">
        {steps.map((step, index) => {
          const completed = index < furthestIndex
          const current = index === currentIndex
          const available = index <= furthestIndex

          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                disabled={!available}
                onClick={() => available && onStepSelect?.(index)}
                aria-current={current ? "step" : undefined}
                aria-label={`${step.label}${completed ? ", completed" : current ? ", current step" : ", not yet available"}`}
                className={cn(
                  "flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-lg px-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:px-2",
                  current && "bg-primary-soft text-primary",
                  completed && !current && "text-muted hover:bg-primary-soft",
                  !available && "cursor-not-allowed text-subtle opacity-55",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    completed && "border-primary bg-primary text-primary-foreground",
                    current && "border-primary bg-background text-primary",
                    !completed && !current && "border-border-strong bg-surface text-subtle",
                  )}
                >
                  {completed ? <Check aria-hidden="true" /> : index + 1}
                </span>
                <span className="hidden truncate md:inline">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
