import type { Metadata } from "next"
import { ResultsView } from "@/components/results/results-view"

export const metadata: Metadata = { title: "Results" }

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-6 flex flex-col gap-2 print:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Assessment results</h1>
        <p className="leading-relaxed text-muted">
          Per-pathway urgency classification with the reasons behind each priority.
        </p>
      </header>
      <ResultsView />
    </div>
  )
}
