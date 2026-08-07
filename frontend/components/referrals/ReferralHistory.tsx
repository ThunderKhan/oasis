"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import useSWR from "swr"
import { AlertCircle, ArrowDownUp, ClipboardList, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriorityBadge } from "@/components/results/PriorityBadge"
import { getAssessments } from "@/lib/api"
import { getPriorityConfig } from "@/lib/priority-config"
import type { AssessmentSummary, Priority } from "@/lib/assessment-types"

const filterOptions: Array<{ value: "all" | Priority; label: string }> = [
  { value: "all", label: "All priorities" },
  { value: "prompt_referral", label: "Prompt referral" },
  { value: "clinical_follow_up", label: "Clinical follow-up" },
  { value: "specialist_risk_assessment", label: "Specialist assessment" },
  { value: "screening_due", label: "Screening due" },
  { value: "routine", label: "Routine" },
]

type SortKey = "created_at" | "assessment_id" | "patient_code" | "overall_priority"
type SortDirection = "asc" | "desc"

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? "Date unavailable" : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
}

export function ReferralHistory() {
  const { data, error, isLoading, mutate } = useSWR("assessment-history", () => getAssessments(), { revalidateOnFocus: false })
  const [query, setQuery] = useState("")
  const [priority, setPriority] = useState<"all" | Priority>("all")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [direction, setDirection] = useState<SortDirection>("desc")
  const reduceMotion = useReducedMotion()

  const records = data ?? []
  const summary = useMemo(() => ({
    total: records.length,
    prompt: records.filter((record) => record.overall_priority === "prompt_referral").length,
    screening: records.filter((record) => record.overall_priority === "screening_due").length,
    followup: records.filter((record) => ["clinical_follow_up", "specialist_risk_assessment", "priority_screening"].includes(record.overall_priority)).length,
  }), [records])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return records
      .filter((record) => priority === "all" || record.overall_priority === priority)
      .filter((record) => !needle || record.assessment_id.toLowerCase().includes(needle) || record.patient_code.toLowerCase().includes(needle))
      .sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
        const comparison = sortKey === "created_at" ? new Date(aValue).valueOf() - new Date(bValue).valueOf() : aValue.localeCompare(bValue)
        return direction === "asc" ? comparison : -comparison
      })
  }, [records, priority, query, sortKey, direction])

  function setSort(next: SortKey) {
    if (next === sortKey) setDirection((current) => current === "asc" ? "desc" : "asc")
    else { setSortKey(next); setDirection("asc") }
  }

  if (isLoading) return <HistorySkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-urgency-referral-border bg-surface px-6 py-12 text-center" role="alert">
        <AlertCircle aria-hidden="true" className="size-8 text-urgency-referral" />
        <div><h2 className="font-semibold">Assessment history could not be loaded</h2><p className="mt-1 text-sm text-muted">Check the assessment service connection and try again.</p></div>
        <Button variant="outline" onClick={() => mutate()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Assessment summary">
        <SummaryCard label="Total assessments" value={summary.total} />
        <SummaryCard label="Prompt referrals" value={summary.prompt} />
        <SummaryCard label="Screenings due" value={summary.screening} />
        <SummaryCard label="Follow-ups required" value={summary.followup} />
      </section>

      <section className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 md:flex-row md:items-center" aria-label="Assessment filters">
        <label className="relative flex-1">
          <span className="sr-only">Search assessment ID or patient code</span>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assessment ID or patient code" className="min-h-11 w-full rounded-lg border border-border-strong bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
        </label>
        <label>
          <span className="sr-only">Filter by priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value as "all" | Priority)} className="min-h-11 w-full rounded-lg border border-border-strong bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:w-52">
            {filterOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="md:hidden">
          <span className="sr-only">Sort assessments</span>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)} className="min-h-11 w-full rounded-lg border border-border-strong bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <option value="created_at">Sort by date</option><option value="assessment_id">Sort by assessment ID</option><option value="patient_code">Sort by patient code</option><option value="overall_priority">Sort by priority</option>
          </select>
        </label>
      </section>

      <motion.div
        key={`${query.trim()}-${priority}-${sortKey}-${direction}-${records.length}`}
        initial={reduceMotion ? false : { opacity: 0.88, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {!records.length ? <EmptyState text="No assessments recorded yet." /> : !visible.length ? <EmptyState text="No assessments match the current filters." /> : (
          <>
            <div className="hidden overflow-hidden rounded-card border border-border bg-surface md:block">
              <div className="max-h-[36rem] overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-background text-xs uppercase tracking-wide text-muted">
                    <tr>
                      {[["assessment_id", "Assessment ID"], ["patient_code", "Patient code"], ["overall_priority", "Overall priority"], ["created_at", "Date and time"]].map(([key, label]) => {
                        const active = sortKey === key
                        return (
                          <th
                            key={key}
                            aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
                            className="border-b border-border px-2 py-1"
                          >
                            <button
                              onClick={() => setSort(key as SortKey)}
                              className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {label}
                              <ArrowDownUp aria-hidden="true" className="size-3" />
                            </button>
                          </th>
                        )
                      })}
                      <th className="border-b border-border px-4 py-3 font-semibold">Status</th>
                      <th className="border-b border-border px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">{visible.map((record) => <HistoryRow key={record.assessment_id} record={record} />)}</tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:hidden">{visible.map((record) => <HistoryCard key={record.assessment_id} record={record} />)}</div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) { return <Card><CardHeader className="p-4 pb-0"><CardTitle className="text-xs font-medium text-muted">{label}</CardTitle></CardHeader><CardContent className="p-4 pt-2"><p className="text-2xl font-semibold tabular-nums">{value}</p></CardContent></Card> }
function DisabledView() { return <button disabled aria-describedby="view-disabled-explanation" title="Detailed assessment retrieval will be enabled when the backend detail endpoint is added." className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium text-muted opacity-60">View</button> }
function HistoryRow({ record }: { record: AssessmentSummary }) { return <tr className="transition-colors duration-150 hover:bg-primary-soft/50 motion-reduce:transition-none"><td className="px-4 py-3 font-medium">{record.assessment_id}</td><td className="px-4 py-3">{record.patient_code}</td><td className="px-4 py-3"><PriorityBadge priority={record.overall_priority} size="sm" /></td><td className="px-4 py-3 text-muted">{formatDate(record.created_at)}</td><td className="px-4 py-3"><span className="rounded-full bg-urgency-routine-soft px-2 py-1 text-xs text-urgency-routine">Not tracked yet</span></td><td className="px-4 py-3"><DisabledView /></td></tr> }
function HistoryCard({ record }: { record: AssessmentSummary }) { return <Card><CardHeader className="p-4 pb-0"><div className="flex flex-col items-start gap-3"><PriorityBadge priority={record.overall_priority} size="sm" /><div className="min-w-0"><CardTitle className="break-all text-sm">{record.assessment_id}</CardTitle><p className="mt-1 text-sm text-muted">Patient {record.patient_code}</p></div></div></CardHeader><CardContent className="flex flex-col items-start gap-3 p-4"><div className="text-sm leading-relaxed text-muted"><p>{formatDate(record.created_at)}</p><p className="mt-1">Status: Not tracked yet</p></div><DisabledView /></CardContent></Card> }
function EmptyState({ text }: { text: string }) { return <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-14 text-center"><ClipboardList aria-hidden="true" className="size-8 text-primary" /><p className="font-medium">{text}</p></div> }
function HistorySkeleton() { return <div className="flex flex-col gap-6" aria-label="Loading assessment history"><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton-shimmer h-24 rounded-card border border-border motion-reduce:bg-border" />)}</div><div className="skeleton-shimmer h-16 rounded-card border border-border motion-reduce:bg-border" /><div className="skeleton-shimmer h-80 rounded-card border border-border motion-reduce:bg-border" /></div> }

export const VIEW_DISABLED_EXPLANATION = "Detailed assessment retrieval will be enabled when the backend detail endpoint is added."
