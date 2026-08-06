import { cn } from "@/lib/utils"
import { getPriorityConfig } from "@/lib/priority-config"
import type { UrgencyCategory } from "@/lib/assessment-types"

interface PriorityBadgeProps {
  priority: UrgencyCategory
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Urgency badge combining icon + text + colour so meaning never
 * relies on colour alone. Urgent categories get stronger treatment.
 */
export function PriorityBadge({ priority, size = "md", className }: PriorityBadgeProps) {
  const config = getPriorityConfig(priority)
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.textClass,
        config.bgClass,
        config.borderClass,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3.5 py-1.5 text-base",
        config.urgent && "font-semibold",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          size === "sm" && "size-3.5",
          size === "md" && "size-4",
          size === "lg" && "size-5",
        )}
      />
      {config.label}
    </span>
  )
}
