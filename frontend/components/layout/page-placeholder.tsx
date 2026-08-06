import { Construction } from "lucide-react"

interface PagePlaceholderProps {
  title: string
  description: string
}

/** Temporary stub used while pages are built out in subsequent passes. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Construction aria-hidden="true" className="size-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-pretty leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  )
}
