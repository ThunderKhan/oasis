import type { Metadata } from "next"
import { PagePlaceholder } from "@/components/layout/page-placeholder"

export const metadata: Metadata = { title: "About" }

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="About O.A.S.I.S."
      description="How the system classifies urgency, what the Screening Priority Index means, and its clinical limitations will be explained here."
    />
  )
}
