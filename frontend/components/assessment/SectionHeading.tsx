import { forwardRef } from "react"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export const SectionHeading = forwardRef<HTMLHeadingElement, SectionHeadingProps>(({ eyebrow, title, description }, ref) => (
  <header className="flex flex-col gap-2 border-b border-border px-5 py-5 md:px-7 md:py-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
    <h2 ref={ref} tabIndex={-1} className="text-balance text-xl font-semibold tracking-tight text-foreground outline-none md:text-2xl">{title}</h2>
    <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
  </header>
))
SectionHeading.displayName = "SectionHeading"
