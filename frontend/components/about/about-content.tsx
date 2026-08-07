"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  ArrowDown,
  BookOpenCheck,
  CheckCircle2,
  FileSearch,
  HeartPulse,
  Landmark,
  Languages,
  LockKeyhole,
  Microscope,
  Network,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const modules = [
  {
    title: "Oral cancer pathway",
    icon: FileSearch,
    text: "Structures oral-screening history, tobacco/areca/alcohol exposure, symptoms, and examination findings. Red-flag findings can raise referral urgency.",
  },
  {
    title: "Breast cancer pathway",
    icon: HeartPulse,
    text: "Structures clinical breast-screening history, current warning findings, and high-risk personal or family history to support screening, follow-up, or specialist-risk prioritisation.",
  },
  {
    title: "Cervical cancer pathway",
    icon: Microscope,
    text: "Structures screening history, previous HPV/VIA/cytology information, HIV status, symptoms, and optional consented research variables. Experimental statistical support cannot lower rule-derived urgency.",
  },
]

const equations = [
  {
    title: "Logistic regression",
    formula: "p = 1 / (1 + e^-(β₀ + βᵀx))",
    note: "Maps a linear combination of input variables to a value between 0 and 1. In O.A.S.I.S., statistical output is experimental support and is not a diagnostic probability.",
  },
  {
    title: "Sensitivity",
    formula: "Sensitivity = TP / (TP + FN)",
    note: "The proportion of true positive cases correctly identified by a model or test in an evaluation dataset.",
  },
  {
    title: "Specificity",
    formula: "Specificity = TN / (TN + FP)",
    note: "The proportion of true negative cases correctly identified by a model or test in an evaluation dataset.",
  },
  {
    title: "Brier score",
    formula: "Brier = (1/N) Σᵢ (pᵢ - yᵢ)²",
    note: "Measures squared error between predicted probabilities and observed binary outcomes; lower is better when evaluating calibrated probabilistic predictions.",
  },
]

const references = [
  {
    source: "Mazo et al. · 2020",
    title: "Clinical Decision Support Systems in Breast Cancer: A Systematic Review",
    supports:
      "Shows that breast-cancer clinical decision-support systems span multiple clinical functions and can assist healthcare professionals with decision-making.",
    implementation:
      "O.A.S.I.S. implements an explainable screening/referral support workflow. This review does not clinically validate O.A.S.I.S.",
  },
  {
    source: "Al Mudawi & Alazeb · 2022",
    title: "A Model for Predicting Cervical Cancer Using Machine Learning Algorithms",
    supports:
      "Demonstrates comparison of conventional machine-learning classifiers on a cervical-cancer risk-factor dataset.",
    implementation:
      "O.A.S.I.S. treats statistical modelling as optional experimental support; published performance from this paper is not claimed for O.A.S.I.S.",
  },
  {
    source: "Hussain et al. · 2024",
    title: "Breast cancer risk prediction using machine learning: a systematic review",
    supports:
      "Reviews machine-learning and deep-learning research using mammography, radiomics, genomics, reports, and clinical information for breast-cancer risk prediction.",
    implementation:
      "The current breast module is history- and rule-based. It does not implement or claim the performance of the reviewed imaging models.",
  },
  {
    source: "Yala et al. · 2019",
    title: "A Deep Learning Mammography-based Model for Improved Breast Cancer Risk Prediction",
    supports:
      "Provides an example of research combining mammograms and traditional risk factors for breast-cancer risk prediction.",
    implementation:
      "O.A.S.I.S. does not reproduce this mammography model; multimodal imaging remains future work.",
  },
  {
    source: "World Health Organization · 2021",
    title:
      "WHO guideline for screening and treatment of cervical pre-cancer lesions for cervical cancer prevention, second edition",
    supports:
      "Provides cervical-screening and treatment recommendations, including differentiated guidance for women living with HIV.",
    implementation:
      "O.A.S.I.S. uses configurable screening-eligibility logic and must still be aligned with local programmes, tests, resources, and referral pathways.",
  },
  {
    source: "Ministry of Health & Family Welfare, Government of India · 2023",
    title:
      "National Programme for Prevention and Control of Non-Communicable Diseases (2023–2030): Operational Guidelines",
    supports:
      "Provides the programme context for population-based screening, early diagnosis, referral, and management of common NCDs, including oral, breast, and cervical cancers.",
    implementation:
      "O.A.S.I.S. is designed around programme-oriented screening and referral support without assuming every state or facility uses identical protocols.",
  },
]

const limitations = [
  "The public cervical dataset used for experimental modelling is limited, incomplete, imbalanced, and not necessarily representative of local screening populations.",
  "O.A.S.I.S. has not undergone prospective or external clinical validation.",
  "Dataset and model behaviour may reflect population bias and may not generalise across regions or demographic groups.",
  "Several inputs depend on self-reported patient history and may be incomplete or inaccurate.",
  "Sensitive reproductive, sexual, and health-history data require informed consent, privacy safeguards, and appropriate access controls.",
  "Screening intervals, eligibility criteria, available tests, and referral routes vary across local protocols.",
]

const roadmap = [
  {
    icon: Stethoscope,
    title: "Clinician review",
    text: "Formal clinical and programme-owner review of rules, wording, workflow, and referral recommendations.",
  },
  {
    icon: Languages,
    title: "Multilingual interface",
    text: "Support locally appropriate languages while preserving clinical meaning and accessibility.",
  },
  {
    icon: Smartphone,
    title: "Offline-first screening camps",
    text: "Enable resilient workflows for outreach settings with intermittent connectivity.",
  },
  {
    icon: CheckCircle2,
    title: "Referral completion tracking",
    text: "Track whether referrals were received and completed instead of displaying unverified status.",
  },
  {
    icon: Users,
    title: "Locally validated datasets",
    text: "Evaluate and calibrate models using representative local datasets with subgroup analysis.",
  },
  {
    icon: ScanLine,
    title: "Multimodal imaging support",
    text: "Explore carefully validated imaging support while keeping clinical oversight explicit.",
  },
  {
    icon: Network,
    title: "Health-system interoperability",
    text: "Integrate with appropriate health-information systems using governed, auditable data exchange.",
  },
]

export function AboutContent() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <Reveal>
        <header className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Research, safety &amp; intended use
            </p>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Scientific and ethical positioning of O.A.S.I.S.
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-muted">
              O.A.S.I.S. is a clinical decision-support prototype for structured
              screening and referral prioritisation—not a diagnostic system.
            </p>
          </div>

          <div className="rounded-card border border-border bg-primary-soft p-5 text-sm leading-relaxed text-primary">
            <ShieldCheck aria-hidden="true" className="mb-3 size-7" />
            <strong className="block">Safety principle</strong>
            Clinical warning signs and rule-derived urgency cannot be suppressed by
            optional statistical support.
          </div>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="does-heading">
          <SectionTitle
            eyebrow="01 · Intended use"
            title="What O.A.S.I.S. does"
            description="A deliberately narrow workflow for clinician-facing screening support."
            id="does-heading"
          />
          <Card className="mt-8">
            <CardContent className="p-6 text-base leading-relaxed">
              O.A.S.I.S. structures patient history, identifies warning signs,
              evaluates screening eligibility, and generates explainable
              referral-priority recommendations for oral, breast, and cervical cancer
              pathways.
            </CardContent>
          </Card>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="does-not-heading">
          <SectionTitle
            eyebrow="02 · Boundaries"
            title="What O.A.S.I.S. does not do"
            description="These limitations are part of the product definition."
            id="does-not-heading"
          />
          <Card className="mt-8 border-urgency-referral-border">
            <CardHeader>
              <XCircle
                aria-hidden="true"
                className="size-7 text-urgency-referral"
              />
              <CardTitle>Not a diagnostic or autonomous clinical system</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList
                items={[
                  "Does not diagnose cancer.",
                  "Does not exclude cancer.",
                  "Does not recommend treatment.",
                  "Does not replace clinical examination.",
                  "Does not autonomously make clinical decisions.",
                  "Is not externally clinically validated.",
                ]}
              />
            </CardContent>
          </Card>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="hybrid-heading">
          <SectionTitle
            eyebrow="03 · Hybrid decision model"
            title="The highest-urgency signal determines the final recommendation"
            description="The hierarchy prevents optional statistical support from downgrading clinical safety rules."
            id="hybrid-heading"
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <DecisionInput
              icon={AlertTriangle}
              title="Clinical safety rules"
              text="Symptoms, abnormal examinations, and concerning previous findings can raise urgency."
            />
            <DecisionInput
              icon={CheckCircle2}
              title="Screening eligibility"
              text="Age, pathway applicability, screening history, and configured intervals determine screening status."
            />
            <DecisionInput
              icon={Microscope}
              title="Optional statistical support"
              text="Experimental statistical support may inform prioritisation but cannot lower rule-derived urgency."
            />
          </div>

          <div className="flex flex-col items-center gap-3 py-5 text-primary">
            <ArrowDown aria-hidden="true" className="size-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Highest urgency among the three inputs
            </span>
          </div>

          <div className="mx-auto max-w-3xl rounded-card border border-primary bg-primary-soft p-5 text-center">
            <p className="font-semibold text-primary">
              Final recommendation = highest urgency among clinical safety rules,
              screening eligibility, and optional statistical support
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="modules-heading">
          <SectionTitle
            eyebrow="04 · Cancer modules"
            title="Oral, breast, and cervical pathways"
            description="Each module structures different history and warning-sign inputs while using the same safety-first priority hierarchy."
            id="modules-heading"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {modules.map(({ title, icon: Icon, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon aria-hidden="true" className="size-7 text-primary" />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="math-heading">
          <SectionTitle
            eyebrow="05 · Mathematical models"
            title="Four compact equations used to explain modelling and evaluation"
            description="These equations describe standard statistical concepts; they do not establish clinical validity for O.A.S.I.S."
            id="math-heading"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {equations.map((equation) => (
              <EquationCard key={equation.title} {...equation} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="research-heading">
          <SectionTitle
            eyebrow="06 · Research basis"
            title="Evidence informs the design; it does not validate this prototype"
            description="Each reference separates what the source supports from what O.A.S.I.S. actually implements."
            id="research-heading"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {references.map((reference) => (
              <ReferenceCard key={reference.title} {...reference} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="limitations-heading">
          <SectionTitle
            eyebrow="07 · Limitations"
            title="Known scientific, data, and deployment constraints"
            description="These constraints should remain visible during research, evaluation, and any future deployment."
            id="limitations-heading"
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {limitations.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-card border border-border bg-surface p-4"
              >
                <Landmark
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="roadmap-heading">
          <SectionTitle
            eyebrow="08 · Future roadmap"
            title="What would be needed beyond the current prototype"
            description="Future capability must be paired with clinical governance, validation, privacy, and workflow evaluation."
            id="roadmap-heading"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {roadmap.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon aria-hidden="true" className="size-6 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <aside
          className="rounded-card border border-urgency-priority-border bg-urgency-priority-soft p-6"
          aria-label="Clinical oversight note"
        >
          <div className="flex items-start gap-4">
            <Stethoscope
              aria-hidden="true"
              className="mt-0.5 size-7 shrink-0 text-urgency-priority"
            />
            <div>
              <h2 className="font-semibold text-urgency-priority">
                Qualified clinical oversight remains necessary
              </h2>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-foreground">
                O.A.S.I.S. supports screening and referral decisions; it does not
                diagnose or exclude cancer. Clinical examination, local protocols,
                diagnostic testing, and professional judgement remain essential.
              </p>
            </div>
          </div>
        </aside>
      </Reveal>
    </div>
  )
}

function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string
  title: string
  description: string
  id: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-2 text-balance text-2xl font-semibold tracking-tight md:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-3 text-pretty leading-relaxed text-muted">
        {description}
      </p>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-relaxed"
        >
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function DecisionInput({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck
  title: string
  text: string
}) {
  return (
    <Card>
      <CardHeader>
        <Icon aria-hidden="true" className="size-7 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted">{text}</p>
      </CardContent>
    </Card>
  )
}

function EquationCard({
  title,
  formula,
  note,
}: {
  title: string
  formula: string
  note: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-x-auto rounded-lg bg-background px-4 py-5 text-center font-mono text-sm font-semibold sm:text-base"
          aria-label={`${title} equation`}
        >
          {formula}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{note}</p>
      </CardContent>
    </Card>
  )
}

function ReferenceCard({
  source,
  title,
  supports,
  implementation,
}: {
  source: string
  title: string
  supports: string
  implementation: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpenCheck aria-hidden="true" className="size-4" />
          {source}
        </div>
        <CardTitle className="text-base leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm leading-relaxed">
        <div>
          <strong className="text-primary">What the source supports</strong>
          <p className="mt-1 text-muted">{supports}</p>
        </div>
        <div className="border-t border-border pt-4">
          <strong>What O.A.S.I.S. actually implements</strong>
          <p className="mt-1 text-muted">{implementation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
