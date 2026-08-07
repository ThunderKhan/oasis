import type { Metadata } from "next"
import { ResultsView } from "@/components/results/results-view"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Screening Recommendation",
  description: "Review pathway-level screening and referral priorities from the latest O.A.S.I.S. assessment.",
}

export default function ResultsPage() {
  return (
    <PageContainer className="py-8 md:py-12 print:max-w-none print:p-0" variant="standard">
      <ResultsView />
    </PageContainer>
  )
}
