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
  /** Jump back to an earlier, already-visited step */
  onStepSelect?: (index: number) => void
}

export function Stepper({ steps, currentIndex, onStepSelect }: StepperProps) {
  return (
    <nav aria-label="Assessment progress">
      <ol className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, index) => {
          const done = index < currentIndex
          const current = index === currentIndex
          const clickable = done && onStepSelect

          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepSelect(index)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                  clickable && "hover:bg-primary-soft",
                  !clickable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    done && "border-primary bg-primary text-primary-foreground",
                    current && "border-primary bg-primary-soft text-primary",
                    !done && !current && "border-border-strong bg-surface text-subtle",
                  )}
                >
                  {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
                  {done && <span className="sr-only">completed</span>}
                </span>
                <span
                  className={cn(
                    "hidden font-medium sm:inline",
                    current ? "text-foreground" : done ? "text-muted" : "text-subtle",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1 h-px w-4 sm:w-8",
                    index < currentIndex ? "bg-primary" : "bg-border-strong",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-xs text-muted sm:sr-only">
        Step {currentIndex + 1} of {steps.length}: {steps[currentIndex]?.label}
      </p>
    </nav>
  )
}
