import type { Metadata } from "next"
import { PageContainer } from "@/components/layout/page-container"
import { ReferralHistory } from "@/components/referrals/ReferralHistory"

export const metadata: Metadata = {
  title: "Assessment History",
  description: "Review assessment history and referral priorities recorded by O.A.S.I.S.",
}

export default function ReferralsPage() {
  return (
    <PageContainer className="py-8 md:py-12" variant="wide">
      <header className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Clinical worklist</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Assessment history</h1>
        <p className="max-w-2xl leading-relaxed text-muted">Search and prioritise submitted assessments. Referral status is not yet stored by the backend.</p>
      </header>
      <p id="view-disabled-explanation" className="sr-only">Detailed assessment retrieval will be enabled when the backend detail endpoint is added.</p>
      <ReferralHistory />
    </PageContainer>
  )
}
