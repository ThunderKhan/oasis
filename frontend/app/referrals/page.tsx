import type { Metadata } from "next"
import { PagePlaceholder } from "@/components/layout/page-placeholder"

export const metadata: Metadata = { title: "Referrals" }

export default function ReferralsPage() {
  return (
    <PagePlaceholder
      title="Referrals"
      description="Referral summaries and recommended actions mapped to local pathways will live here."
    />
  )
}
