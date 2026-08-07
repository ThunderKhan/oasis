"use client"

import { useId } from "react"
import { AlertTriangle } from "lucide-react"
import { RedFlagNotice } from "@/components/assessment/RedFlagNotice"
import { cn } from "@/lib/utils"

interface QuestionToggleProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  description?: string
  redFlag?: boolean
  compact?: boolean
}

export function QuestionToggle({
  label,
  value,
  onChange,
  description,
  redFlag = false,
  compact = false,
}: QuestionToggleProps) {
  const name = useId()
  const labelId = useId()
  const descriptionId = useId()

  return (
    <fieldset
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-lg border bg-surface p-4 transition-colors",
        compact
          ? "sm:min-h-36 sm:justify-between"
          : "sm:min-h-20 sm:flex-row sm:items-center sm:justify-between",
        redFlag && value ? "border-urgency-referral-border bg-urgency-referral-soft" : "border-border",
      )}
    >
      <legend className="sr-only">{label}</legend>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span id={labelId} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-foreground">
          {redFlag && (
            <AlertTriangle
              aria-hidden="true"
              className={cn("mt-0.5 size-4 shrink-0", value ? "text-urgency-referral" : "text-muted")}
            />
          )}
          <span>{label}</span>
        </span>
        {description && (
          <span id={descriptionId} className="text-sm leading-relaxed text-muted">
            {description}
          </span>
        )}
        {redFlag && value && <RedFlagNotice />}
      </div>

      <div className="grid min-w-40 grid-cols-2 overflow-hidden rounded-lg border border-border-strong bg-background p-1">
        {[
          { label: "Yes", option: true },
          { label: "No", option: false },
        ].map(({ label: optionLabel, option }) => {
          const id = `${name}-${option ? "yes" : "no"}`
          const selected = value === option
          const urgentSelection = redFlag && option && selected

          return (
            <label
              key={id}
              htmlFor={id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors duration-150 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 motion-reduce:transition-none",
                urgentSelection
                  ? "bg-urgency-referral text-white"
                  : selected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-primary-soft hover:text-primary",
              )}
            >
              <input
                id={id}
                name={name}
                type="radio"
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {optionLabel}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
