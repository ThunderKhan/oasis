import { ArrowRight, CalendarClock } from "lucide-react"
import type { Priority } from "@/lib/assessment-types"

interface RecommendedActionProps {
  action: string
  priority: Priority
  screeningDue: boolean
}

export function RecommendedAction({ action, priority, screeningDue }: RecommendedActionProps) {
  return (
    <section aria-labelledby={`action-${priority}`} className="flex flex-col gap-2 rounded-lg bg-primary-soft p-4">
      <p id={`action-${priority}`} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
        <ArrowRight aria-hidden="true" className="size-4" />
        Recommended next action
      </p>
      {priority === "prompt_referral" && <p className="font-semibold text-urgency-referral">Prompt clinical evaluation recommended</p>}
      <p className="text-sm font-medium leading-relaxed text-foreground">{action}</p>
      {screeningDue && (
        <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
          <CalendarClock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          Schedule routine screening according to the configured programme.
        </p>
      )}
    </section>
  )
}
