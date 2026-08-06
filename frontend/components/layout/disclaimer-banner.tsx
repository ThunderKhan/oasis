import { ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"

interface DisclaimerBannerProps {
  className?: string
  /** Optional override — defaults to the fixed system disclaimer */
  text?: string
}

/** Mandatory clinical disclaimer. Shown on every results surface. */
export function DisclaimerBanner({ className, text = SYSTEM_DISCLAIMER }: DisclaimerBannerProps) {
  return (
    <aside
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-clinical-blue/25 bg-clinical-blue-soft px-4 py-3 text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clinical-blue" />
      <p>{text}</p>
    </aside>
  )
}
