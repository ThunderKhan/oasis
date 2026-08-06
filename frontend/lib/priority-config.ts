import type { LucideIcon } from "lucide-react"
import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CircleCheck,
  Stethoscope,
  UserSearch,
} from "lucide-react"
import type { UrgencyCategory } from "./assessment-types"

export interface PriorityConfig {
  /** Machine key from the backend */
  key: UrgencyCategory
  /** Human label shown in UI */
  label: string
  /** Short clinical description of what this category means */
  description: string
  /** Icon reinforcing meaning without relying on colour alone */
  icon: LucideIcon
  /** Sort weight — higher is more urgent */
  weight: number
  /** True for categories that must feel visually urgent */
  urgent: boolean
  /** Tailwind classes (theme tokens) */
  textClass: string
  bgClass: string
  borderClass: string
  /** Solid variant for score bars / emphasis */
  solidClass: string
}

export const PRIORITY_ORDER: UrgencyCategory[] = [
  "routine",
  "screening_due",
  "priority_screening",
  "specialist_risk_assessment",
  "clinical_follow_up",
  "prompt_referral",
]

export const PRIORITY_CONFIG: Record<UrgencyCategory, PriorityConfig> = {
  routine: {
    key: "routine",
    label: "Routine",
    description: "No elevated indicators identified. Continue age-appropriate screening.",
    icon: CircleCheck,
    weight: 1,
    urgent: false,
    textClass: "text-urgency-routine",
    bgClass: "bg-urgency-routine-soft",
    borderClass: "border-urgency-routine-border",
    solidClass: "bg-urgency-routine",
  },
  screening_due: {
    key: "screening_due",
    label: "Screening due",
    description: "Screening interval has lapsed. Schedule screening at the next opportunity.",
    icon: CalendarClock,
    weight: 2,
    urgent: false,
    textClass: "text-urgency-screening",
    bgClass: "bg-urgency-screening-soft",
    borderClass: "border-urgency-screening-border",
    solidClass: "bg-urgency-screening",
  },
  priority_screening: {
    key: "priority_screening",
    label: "Priority screening",
    description: "Risk factors warrant earlier screening than the routine interval.",
    icon: AlertTriangle,
    weight: 3,
    urgent: false,
    textClass: "text-urgency-priority",
    bgClass: "bg-urgency-priority-soft",
    borderClass: "border-urgency-priority-border",
    solidClass: "bg-urgency-priority",
  },
  specialist_risk_assessment: {
    key: "specialist_risk_assessment",
    label: "Specialist risk assessment",
    description: "Risk profile warrants structured assessment by a specialist service.",
    icon: UserSearch,
    weight: 4,
    urgent: true,
    textClass: "text-urgency-specialist",
    bgClass: "bg-urgency-specialist-soft",
    borderClass: "border-urgency-specialist-border",
    solidClass: "bg-urgency-specialist",
  },
  clinical_follow_up: {
    key: "clinical_follow_up",
    label: "Clinical follow-up",
    description: "Findings require timely clinical review and follow-up.",
    icon: Stethoscope,
    weight: 5,
    urgent: true,
    textClass: "text-urgency-followup",
    bgClass: "bg-urgency-followup-soft",
    borderClass: "border-urgency-followup-border",
    solidClass: "bg-urgency-followup",
  },
  prompt_referral: {
    key: "prompt_referral",
    label: "Prompt referral",
    description: "Red-flag findings. Refer according to the local pathway without delay.",
    icon: AlertOctagon,
    weight: 6,
    urgent: true,
    textClass: "text-urgency-referral",
    bgClass: "bg-urgency-referral-soft",
    borderClass: "border-urgency-referral-border",
    solidClass: "bg-urgency-referral",
  },
}

export function getPriorityConfig(priority: UrgencyCategory): PriorityConfig {
  return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.routine
}

export const CANCER_TYPE_LABELS: Record<string, string> = {
  oral: "Oral",
  breast: "Breast",
  cervical: "Cervical",
}

/** Mandatory clinical communication copy */
export const SCORE_LABEL = "Screening Priority Index"
export const SCORE_CAVEAT =
  "The Screening Priority Index reflects screening and referral urgency. It is not a probability of cancer, and a low index does not rule cancer out."
export const SYSTEM_DISCLAIMER =
  "O.A.S.I.S. supports screening and referral decisions; it does not diagnose or exclude cancer."
