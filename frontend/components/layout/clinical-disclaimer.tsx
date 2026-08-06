import { ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"

interface ClinicalDisclaimerProps {
  className?: string
  text?: string
  variant?: "compact" | "full"
}

export function ClinicalDisclaimer({
  className,
  text = SYSTEM_DISCLAIMER,
  variant = "compact",
}: ClinicalDisclaimerProps) {
  return (
    <aside
      role="note"
      aria-label="Clinical disclaimer"
      className={cn(
        "flex items-start gap-3 rounded-lg border border-clinical-blue/25 bg-clinical-blue-soft text-foreground",
        variant === "compact" ? "px-4 py-3 text-sm" : "px-5 py-4 text-base",
        className,
      )}
    >
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clinical-blue" />
      <p className="leading-relaxed">{text}</p>
    </aside>
  )
}
