import { AlertTriangle } from "lucide-react"

export function RedFlagNotice() {
  return (
    <p className="flex items-start gap-2 text-xs font-medium leading-relaxed text-urgency-referral">
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>This answer may require prompt clinical evaluation.</span>
    </p>
  )
}
