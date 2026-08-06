import type { ReactNode } from "react"

interface AssessmentShellProps {
  navigation: ReactNode
  mobileProgress: ReactNode
  children: ReactNode
  utilityRail: ReactNode
  mobileActions: ReactNode
}

export function AssessmentShell({ navigation, mobileProgress, children, utilityRail, mobileActions }: AssessmentShellProps) {
  return (
    <div className="flex min-w-0 flex-col gap-5 pb-24 md:pb-0">
      <div className="lg:hidden">{mobileProgress}</div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] 2xl:grid-cols-[14rem_minmax(0,1fr)_16rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{navigation}</div>
        </aside>
        <main className="min-w-0">{children}</main>
        <aside className="hidden 2xl:block">
          <div className="sticky top-24">{utilityRail}</div>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur md:hidden">
        <div className="mx-auto max-w-7xl">{mobileActions}</div>
      </div>
    </div>
  )
}
