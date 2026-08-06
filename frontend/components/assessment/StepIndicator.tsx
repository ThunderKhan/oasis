import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  index: number
  completed: boolean
  current: boolean
}

export function StepIndicator({ index, completed, current }: StepIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
        completed && "border-primary bg-primary text-primary-foreground",
        current && !completed && "border-primary bg-surface text-primary",
        !completed && !current && "border-border-strong bg-background text-subtle",
      )}
    >
      {completed ? <Check /> : index + 1}
    </span>
  )
}
