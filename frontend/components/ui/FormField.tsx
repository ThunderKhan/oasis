import { useId, type ReactNode } from "react"
import { InlineValidation } from "@/components/ui/InlineValidation"

interface FormFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: {
    id: string
    describedBy: string | undefined
    invalid: boolean
  }) => ReactNode
}

export function FormField({ label, hint, error, required = false, children }: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-urgency-referral">
            {" *"}
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {children({ id, describedBy, invalid: Boolean(error) })}
      <InlineValidation id={errorId} message={error} />
    </div>
  )
}
