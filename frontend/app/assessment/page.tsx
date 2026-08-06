import type { Metadata } from "next"
import { AssessmentWizard } from "@/components/assessment/assessment-wizard"
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner"

export const metadata: Metadata = { title: "New assessment" }

export default function AssessmentPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:px-6 md:pb-10 md:pt-12 lg:px-8">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">New assessment</h1>
        <p className="leading-relaxed text-muted">
          Guided intake for the oral, breast, and cervical screening pathways. Progress is saved in
          this browser session until you submit.
        </p>
      </header>
      <DisclaimerBanner className="mb-6" />
      <AssessmentWizard />
    </div>
  )
}
