import type { ReactNode } from "react"

interface QuestionGroupProps {
  section: string
  title: string
  description?: string
  children: ReactNode
}

export function QuestionGroup({ section, title, description, children }: QuestionGroupProps) {
  return (
    <section aria-labelledby={`${section}-title`} className="flex flex-col gap-4">
      <header className="flex items-start gap-3 border-b border-border pb-3">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-bold text-primary"
        >
          {section}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 id={`${section}-title`} className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
        </div>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
