import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageContainerVariant = "standard" | "wide" | "narrow"

const widths: Record<PageContainerVariant, string> = {
  standard: "max-w-6xl",
  wide: "max-w-7xl",
  narrow: "max-w-3xl",
}

interface PageContainerProps<T extends ElementType = "div"> {
  as?: T
  children: ReactNode
  className?: string
  variant?: PageContainerVariant
}

export function PageContainer<T extends ElementType = "div">({
  as,
  children,
  className,
  variant = "standard",
}: PageContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof PageContainerProps<T>>) {
  const Component = as ?? "div"

  return (
    <Component className={cn("mx-auto w-full px-4 md:px-6 lg:px-8", widths[variant], className)}>
      {children}
    </Component>
  )
}
