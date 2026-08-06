import type { Metadata } from "next"
import { PagePlaceholder } from "@/components/layout/page-placeholder"

export const metadata: Metadata = { title: "Results" }

export default function ResultsPage() {
  return (
    <PagePlaceholder
      title="Results"
      description="Per-pathway urgency classification, Screening Priority Index, and explainable reasons will be displayed here."
    />
  )
}
