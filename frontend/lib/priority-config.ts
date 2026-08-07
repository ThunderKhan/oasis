import type { LucideIcon } from "lucide-react"
import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CircleCheck,
  Stethoscope,
  UserSearch,
} from "lucide-react"
import type { Priority } from "./assessment-types"

export interface PriorityConfig {
  key: Priority
  label: string
  description: string
  icon: LucideIcon
  textClasses: string
  borderClasses: string
  backgroundClasses: string
  urgencyRank: number
  // Compatibility fields used by the existing results components.
  textClass: string
  borderClass: string
  bgClass: string
  solidClass: string
  weight: number
  urgent: boolean
}

function priorityConfig(
  config: Omit<PriorityConfig, "textClass" | "borderClass" | "bgClass" | "weight" | "urgent">,
): PriorityConfig {
  return {
    ...config,
    textClass: config.textClasses,
    borderClass: config.borderClasses,
    bgClass: config.backgroundClasses,
    weight: config.urgencyRank,
    urgent: config.urgencyRank >= 4,
  }
}

export const PRIORITY_ORDER: Priority[] = [
  "routine",
  "screening_due",
  "priority_screening",
  "specialist_risk_assessment",
  "clinical_follow_up",
  "prompt_referral",
]

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  routine: priorityConfig({
    key: "routine",
    label: "Routine",
    description: "No higher-urgency indicators were identified from the information entered. Continue programme-based screening and investigate new or persistent symptoms clinically.",
    icon: CircleCheck,
    textClasses: "text-urgency-routine",
    borderClasses: "border-urgency-routine-border",
    backgroundClasses: "bg-urgency-routine-soft",
    solidClass: "bg-urgency-routine",
    urgencyRank: 1,
  }),
  screening_due: priorityConfig({
    key: "screening_due",
    label: "Screening due",
    description: "The screening interval has lapsed. Schedule screening at the next opportunity.",
    icon: CalendarClock,
    textClasses: "text-urgency-screening",
    borderClasses: "border-urgency-screening-border",
    backgroundClasses: "bg-urgency-screening-soft",
    solidClass: "bg-urgency-screening",
    urgencyRank: 2,
  }),
  priority_screening: priorityConfig({
    key: "priority_screening",
    label: "Priority screening",
    description: "Risk factors warrant earlier screening than the routine interval.",
    icon: AlertTriangle,
    textClasses: "text-urgency-priority",
    borderClasses: "border-urgency-priority-border",
    backgroundClasses: "bg-urgency-priority-soft",
    solidClass: "bg-urgency-priority",
    urgencyRank: 3,
  }),
  specialist_risk_assessment: priorityConfig({
    key: "specialist_risk_assessment",
    label: "Specialist risk assessment",
    description: "The risk profile warrants structured assessment by a specialist service.",
    icon: UserSearch,
    textClasses: "text-urgency-specialist",
    borderClasses: "border-urgency-specialist-border",
    backgroundClasses: "bg-urgency-specialist-soft",
    solidClass: "bg-urgency-specialist",
    urgencyRank: 4,
  }),
  clinical_follow_up: priorityConfig({
    key: "clinical_follow_up",
    label: "Clinical follow-up",
    description: "Prior findings require timely clinical review and follow-up.",
    icon: Stethoscope,
    textClasses: "text-urgency-followup",
    borderClasses: "border-urgency-followup-border",
    backgroundClasses: "bg-urgency-followup-soft",
    solidClass: "bg-urgency-followup",
    urgencyRank: 5,
  }),
  prompt_referral: priorityConfig({
    key: "prompt_referral",
    label: "Prompt referral",
    description: "Red-flag findings require referral through the local pathway without delay.",
    icon: AlertOctagon,
    textClasses: "text-urgency-referral",
    borderClasses: "border-urgency-referral-border",
    backgroundClasses: "bg-urgency-referral-soft",
    solidClass: "bg-urgency-referral",
    urgencyRank: 6,
  }),
}

export function getPriorityConfig(priority: Priority): PriorityConfig {
  return PRIORITY_CONFIG[priority]
}

export const CANCER_TYPE_LABELS: Record<string, string> = {
  oral: "Oral",
  breast: "Breast",
  cervical: "Cervical",
}

export const SCORE_LABEL = "Screening Priority Index"
export const SCORE_CAVEAT =
  "The Screening Priority Index reflects screening and referral urgency. It is not a probability of cancer, and a low index does not rule cancer out."
export const SYSTEM_DISCLAIMER =
  "O.A.S.I.S. supports screening and referral decisions; it does not diagnose or exclude cancer."
