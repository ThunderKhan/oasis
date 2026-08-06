import { Construction } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

interface PagePlaceholderProps {
  title: string
  description: string
}

/** Temporary route content composed inside the shared page shell. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <PageContainer as="section" className="py-16 md:py-24" variant="narrow">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Construction aria-hidden="true" className="size-6" />
        </span>
        <h1 className="text-balance text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-pretty leading-relaxed text-muted">{description}</p>
      </div>
    </PageContainer>
  )
}
