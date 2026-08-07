"use client"

import Link from "next/link"
import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import useSWR from "swr"
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from "lucide-react"
import { PriorityBadge } from "@/components/results/PriorityBadge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAssessments } from "@/lib/api"
import { PRIORITY_CONFIG, PRIORITY_ORDER } from "@/lib/priority-config"
import type { AssessmentSummary, Priority } from "@/lib/assessment-types"

const ATTENTION_PRIORITIES: Priority[] = [
  "prompt_referral",
  "clinical_follow_up",
  "specialist_risk_assessment",
]

function timestamp(value: string) {
  const parsed = new Date(value).valueOf()
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? "Date unavailable"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
}

export function DashboardOverview() {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "dashboard-assessments",
    () => getAssessments(),
    { revalidateOnFocus: false },
  )

  const summary = useMemo(() => buildSummary(data ?? []), [data])

  if (isLoading) return <DashboardLoading />

  if (error) {
    return (
      <div className="flex min-h-[26rem] items-center justify-center">
        <Card className="w-full max-w-xl border-urgency-referral-border" role="alert">
          <CardHeader className="items-center text-center">
            <AlertCircle
              aria-hidden="true"
              className="size-9 text-urgency-referral"
            />
            <CardTitle>Dashboard data could not be loaded</CardTitle>
            <CardDescription>
              The assessment service is unavailable. No estimated or placeholder
              metrics are shown.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => mutate()}
              disabled={isValidating}
            >
              <RefreshCw aria-hidden="true" data-icon="inline-start" />
              {isValidating ? "Retrying…" : "Try again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Operational overview
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Assessment workload at a glance
          </h1>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
            Live counts derived only from completed assessment summaries returned by
            the assessment service.
          </p>
        </div>
        <Link
          href="/assessment"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Start assessment
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </header>

      {!summary.total ? (
        <EmptyDashboard />
      ) : (
        <>
          <section
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            aria-label="Assessment summary"
          >
            <MetricCard
              icon={ClipboardCheck}
              label="Total assessments"
              value={summary.total}
              note="Completed records"
            />
            <MetricCard
              icon={ShieldAlert}
              label="Prompt referrals"
              value={summary.counts.prompt_referral}
              note="Highest urgency"
              urgent
            />
            <MetricCard
              icon={Stethoscope}
              label="Clinical follow-ups"
              value={summary.counts.clinical_follow_up}
              note="Timely review"
            />
            <MetricCard
              icon={CalendarDays}
              label="Screening-due assessments"
              value={summary.counts.screening_due}
              note="Screening workload"
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <PriorityDistribution
              counts={summary.counts}
              total={summary.total}
            />
            <ScreeningWorkload
              screeningDue={summary.counts.screening_due}
              priorityScreening={summary.counts.priority_screening}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RecordList
              title="Referral attention queue"
              description="Prompt-referral, clinical-follow-up, and specialist-risk records"
              records={summary.attention.slice(0, 6)}
              emptyText="No records currently require escalated referral attention."
            />
            <RecordList
              title="Recent assessments"
              description="Latest completed assessment summaries"
              records={summary.recent.slice(0, 6)}
              emptyText="No recent assessments are available."
            />
          </div>
        </>
      )}

      <aside
        className="flex items-start gap-3 rounded-card border border-border bg-primary-soft p-4 text-sm leading-relaxed text-primary"
        aria-label="Clinical disclaimer"
      >
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <p>
          <strong>Operational summary:</strong> Operational summaries support
          workload planning and do not represent disease prevalence.
        </p>
      </aside>
    </div>
  )
}

function buildSummary(records: AssessmentSummary[]) {
  const counts = Object.fromEntries(
    PRIORITY_ORDER.map((priority) => [priority, 0]),
  ) as Record<Priority, number>

  for (const record of records) {
    counts[record.overall_priority] += 1
  }

  const recent = [...records].sort(
    (a, b) => timestamp(b.created_at) - timestamp(a.created_at),
  )

  return {
    total: records.length,
    counts,
    recent,
    attention: recent.filter((record) =>
      ATTENTION_PRIORITIES.includes(record.overall_priority),
    ),
  }
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  urgent = false,
}: {
  icon: typeof ClipboardCheck
  label: string
  value: number
  note: string
  urgent?: boolean
}) {
  return (
    <Card className={urgent ? "border-urgency-referral-border" : undefined}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium text-muted">
            {label}
          </CardTitle>
          <Icon
            aria-hidden="true"
            className={
              urgent ? "size-5 text-urgency-referral" : "size-5 text-primary"
            }
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted">{note}</p>
      </CardContent>
    </Card>
  )
}

function PriorityDistribution({
  counts,
  total,
}: {
  counts: Record<Priority, number>
  total: number
}) {
  const reduceMotion = useReducedMotion()
  const max = Math.max(...Object.values(counts), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority distribution</CardTitle>
        <CardDescription>
          Actual record counts across all six overall-priority categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col gap-4"
          role="img"
          aria-label={`Priority distribution for ${total} assessments`}
        >
          {[...PRIORITY_ORDER].reverse().map((priority) => {
            const config = PRIORITY_CONFIG[priority]
            const count = counts[priority]
            return (
              <div
                key={priority}
                className="grid grid-cols-[minmax(0,1fr)_2rem] items-center gap-2 sm:grid-cols-[minmax(8rem,0.9fr)_minmax(7rem,1.7fr)_2rem] sm:gap-3"
              >
                <span className="col-span-2 text-sm text-muted sm:col-span-1">{config.label}</span>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-background"
                  aria-hidden="true"
                >
                  <motion.div
                    className={`h-full rounded-full ${config.solidClass}`}
                    initial={reduceMotion ? false : { width: 0 }}
                    animate={{ width: `${(count / max) * 100}%` }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
                <span className="text-right text-sm font-semibold tabular-nums">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function ScreeningWorkload({
  screeningDue,
  priorityScreening,
}: {
  screeningDue: number
  priorityScreening: number
}) {
  const items = [
    {
      label: "Screening due",
      value: screeningDue,
      icon: CalendarDays,
    },
    {
      label: "Priority screening",
      value: priorityScreening,
      icon: Clock3,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screening workload</CardTitle>
        <CardDescription>
          Counts derived directly from overall-priority summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <Icon aria-hidden="true" className="size-5 text-primary" />
              {label}
            </div>
            <span className="text-xl font-semibold tabular-nums">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RecordList({
  title,
  description,
  records,
  emptyText,
}: {
  title: string
  description: string
  records: AssessmentSummary[]
  emptyText: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <Link
          href="/referrals"
          className="shrink-0 text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {!records.length ? (
          <p className="rounded-lg bg-background p-5 text-sm text-muted">
            {emptyText}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {records.map((record) => (
              <li
                key={record.assessment_id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    Patient {record.patient_code}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <Clock3 aria-hidden="true" className="size-3.5" />
                    {formatDate(record.created_at)}
                  </p>
                </div>
                <PriorityBadge
                  priority={record.overall_priority}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyDashboard() {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center pt-12 text-center">
        <ClipboardCheck aria-hidden="true" className="size-10 text-primary" />
        <CardTitle>No completed assessments yet</CardTitle>
        <CardDescription className="max-w-md">
          Metrics will appear here after the assessment service records its first
          completed assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-12">
        <Link
          href="/assessment"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Start the first assessment
        </Link>
      </CardContent>
    </Card>
  )
}

function DashboardLoading() {
  return (
    <div
      className="flex flex-col gap-8"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="border-b border-border pb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Operational overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Loading assessment workload…
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="skeleton-shimmer h-28 motion-reduce:bg-border" />
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="skeleton-shimmer h-72 motion-reduce:bg-border" />
      </Card>
    </div>
  )
}
