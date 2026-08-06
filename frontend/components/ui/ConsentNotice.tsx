import { useId } from "react"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { InlineValidation } from "@/components/ui/InlineValidation"

interface ConsentNoticeProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

export function ConsentNotice({ checked, onChange, error }: ConsentNoticeProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-4 transition-[border-color,box-shadow]",
        error ? "border-urgency-referral" : "border-border-strong",
      )}
    >
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex items-start gap-2 text-sm font-medium leading-relaxed text-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              I confirm that consent has been obtained to use the provided information for this screening assessment.
            </span>
          </span>
          <span className="text-xs leading-relaxed text-muted">Required before continuing.</span>
        </span>
      </label>
      <div className="mt-2 pl-7">
        <InlineValidation id={errorId} message={error} />
      </div>
    </div>
  )
}
