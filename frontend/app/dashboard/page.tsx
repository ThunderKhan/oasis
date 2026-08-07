import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Operational Dashboard",
  description: "Live assessment workload and referral-priority overview for O.A.S.I.S.",
}

export default function DashboardPage() {
  return (
    <PageContainer as="section" variant="wide" className="py-10 md:py-14">
      <DashboardOverview />
    </PageContainer>
  )
}
