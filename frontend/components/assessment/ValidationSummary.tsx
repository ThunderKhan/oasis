import { AlertCircle } from "lucide-react"
import type { FieldErrors } from "@/lib/validation"

export function ValidationSummary({ errors }: { errors: FieldErrors }) {
  const messages = Object.values(errors)
  if (messages.length === 0) return null
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-4 text-urgency-referral">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">Please review this section</p>
        <p className="text-sm leading-relaxed">{messages.length === 1 ? messages[0] : `${messages.length} responses need attention before you can continue.`}</p>
      </div>
    </div>
  )
}
