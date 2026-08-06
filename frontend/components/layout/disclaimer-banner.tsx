import { ClinicalDisclaimer } from "@/components/layout/clinical-disclaimer"

interface DisclaimerBannerProps {
  className?: string
  /** Optional override — defaults to the fixed system disclaimer. */
  text?: string
}

/** Compatibility wrapper retained for existing assessment and results surfaces. */
export function DisclaimerBanner({ className, text }: DisclaimerBannerProps) {
  return <ClinicalDisclaimer className={className} text={text} variant="compact" />
}
