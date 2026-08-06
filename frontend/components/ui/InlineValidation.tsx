import { AlertCircle } from "lucide-react"

interface InlineValidationProps {
  id?: string
  message?: string
}

export function InlineValidation({ id, message }: InlineValidationProps) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className="flex min-h-5 items-start gap-1.5 text-xs font-medium leading-relaxed text-urgency-referral"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  )
}
