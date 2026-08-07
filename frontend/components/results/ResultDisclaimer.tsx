import { ShieldAlert } from "lucide-react"
import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"

export function ResultDisclaimer({ disclaimer }: { disclaimer?: string }) {
  return (
    <aside className="flex items-start gap-3 rounded-card border border-border bg-surface p-4" aria-label="Assessment limitation">
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">Clinical review required</p>
        <p className="text-sm leading-relaxed text-muted">{disclaimer || SYSTEM_DISCLAIMER}</p>
        <p className="text-xs leading-relaxed text-muted">A low priority result does not exclude cancer. New, persistent, or concerning symptoms require clinical assessment.</p>
      </div>
    </aside>
  )
}
