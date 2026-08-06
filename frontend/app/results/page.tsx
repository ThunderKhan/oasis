import type { Metadata } from "next"
import { ResultsView } from "@/components/results/results-view"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = { title: "Results" }

export default function ResultsPage() {
  return (
    <PageContainer className="py-8 md:py-12" variant="narrow">
      <header className="mb-6 flex flex-col gap-2 print:hidden">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">Assessment results</h1>
        <p className="leading-relaxed text-muted">
          Per-pathway urgency classification with the reasons behind each priority.
        </p>
      </header>
      <ResultsView />
    </PageContainer>
  )
}
