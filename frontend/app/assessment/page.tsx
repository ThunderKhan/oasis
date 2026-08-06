import type { Metadata } from "next"
import { AssessmentWizard } from "@/components/assessment/assessment-wizard"
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = { title: "New assessment" }

export default function AssessmentPage() {
  return (
    <PageContainer className="py-8 md:py-10" variant="wide">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">New assessment</h1>
        <p className="leading-relaxed text-muted">
          Guided intake for the oral, breast, and cervical screening pathways. Progress is saved in
          this browser session until you submit.
        </p>
      </header>
      <DisclaimerBanner className="mb-6" />
      <AssessmentWizard />
    </PageContainer>
  )
}
