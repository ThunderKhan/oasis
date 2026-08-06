import type { Metadata } from "next"
import { PagePlaceholder } from "@/components/layout/page-placeholder"

export const metadata: Metadata = { title: "New assessment" }

export default function AssessmentPage() {
  return (
    <PagePlaceholder
      title="New assessment"
      description="The guided multi-step intake for oral, breast, and cervical pathways will be built here in the next pass."
    />
  )
}
