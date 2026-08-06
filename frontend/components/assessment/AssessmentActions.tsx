import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AssessmentActionsProps {
  backDisabled: boolean
  submitting: boolean
  primaryLabel: string
  submit?: boolean
  mobile?: boolean
  onBack: () => void
  onPrimary: () => void
}

export function AssessmentActions({ backDisabled, submitting, primaryLabel, submit = false, mobile = false, onBack, onPrimary }: AssessmentActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", mobile ? "w-full" : "justify-between")}>
      <Button type="button" variant="outline" size={mobile ? "lg" : "md"} onClick={onBack} disabled={backDisabled || submitting} className={mobile ? "flex-1" : undefined}>
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        Back
      </Button>
      <Button type="button" size={mobile ? "lg" : "md"} onClick={onPrimary} disabled={submitting} className={mobile ? "flex-[1.4]" : undefined}>
        {submitting ? <Loader2 data-icon="inline-start" aria-hidden="true" className="animate-spin" /> : submit ? <Send data-icon="inline-start" aria-hidden="true" /> : null}
        {submitting ? "Submitting…" : primaryLabel}
        {!submitting && !submit && <ArrowRight data-icon="inline-end" aria-hidden="true" />}
      </Button>
    </div>
  )
}
