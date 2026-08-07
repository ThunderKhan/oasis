import type { Metadata } from "next"
import { AboutContent } from "@/components/about/about-content"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Scientific & Ethical Basis",
  description: "The intended use, hybrid decision model, evidence basis, and limitations of O.A.S.I.S.",
}

export default function AboutPage() {
  return (
    <PageContainer as="article" variant="wide" className="py-10 md:py-14">
      <AboutContent />
    </PageContainer>
  )
}
