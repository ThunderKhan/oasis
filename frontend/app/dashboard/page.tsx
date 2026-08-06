import type { Metadata } from "next"
import { PagePlaceholder } from "@/components/layout/page-placeholder"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="Dashboard"
      description="An overview of completed assessments and their urgency distribution will be shown here."
    />
  )
}
