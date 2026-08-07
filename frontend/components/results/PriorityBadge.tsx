import { cn } from "@/lib/utils"
import { getPriorityConfig } from "@/lib/priority-config"
import type { Priority } from "@/lib/assessment-types"

interface PriorityBadgeProps {
  priority: Priority
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriorityBadge({ priority, size = "md", className }: PriorityBadgeProps) {
  const config = getPriorityConfig(priority)
  const Icon = config.icon

  return (
    <span
      aria-label={`Priority: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.textClasses,
        config.backgroundClasses,
        config.borderClasses,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3.5 py-1.5 text-base font-semibold",
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn(size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4")} />
      {config.label}
    </span>
  )
}
