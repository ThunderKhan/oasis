import { useId } from "react"
import { cn } from "@/lib/utils"
import { InlineValidation } from "@/components/ui/InlineValidation"

interface Choice<T extends string> {
  value: T
  label: string
  description?: string
}

interface ChoiceCardProps<T extends string> {
  legend: string
  value: T
  choices: Choice<T>[]
  onChange: (value: T) => void
  hint?: string
  error?: string
  required?: boolean
}

export function ChoiceCard<T extends string>({
  legend,
  value,
  choices,
  onChange,
  hint,
  error,
  required = false,
}: ChoiceCardProps<T>) {
  const groupName = useId()
  const hintId = `${groupName}-hint`
  const errorId = `${groupName}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0" aria-describedby={describedBy}>
      <legend className="text-sm font-medium text-foreground">
        {legend}
        {required ? (
          <span aria-hidden="true" className="text-urgency-referral">
            {" *"}
          </span>
        ) : null}
      </legend>
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {choices.map((choice) => {
          const id = `${groupName}-${choice.value}`
          const selected = choice.value === value

          return (
            <label
              key={choice.value}
              htmlFor={id}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-[border-color,background-color,box-shadow] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                selected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong bg-surface text-foreground hover:border-primary",
                error && "border-urgency-referral",
              )}
            >
              <input
                id={id}
                name={groupName}
                type="radio"
                value={choice.value}
                checked={selected}
                aria-invalid={error ? true : undefined}
                onChange={() => onChange(choice.value)}
                className="size-4 shrink-0 accent-primary"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">{choice.label}</span>
                {choice.description ? (
                  <span className="text-xs leading-relaxed text-muted">{choice.description}</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
      <InlineValidation id={errorId} message={error} />
    </fieldset>
  )
}
