import type { ReactNode } from 'react'

export function KpiTile({ label, value, sub, icon, live, accent }: { label: ReactNode; value: ReactNode; sub?: ReactNode; icon?: ReactNode; live?: ReactNode; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${accent ? 'border-transparent bg-brand text-white dark:text-[#0a1120]' : 'border-line bg-surface'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`text-xs font-semibold uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal ${accent ? 'opacity-80' : 'text-muted'}`}>{label}</div>
        {icon && <div className={`rounded-lg p-1.5 ${accent ? 'bg-white/15' : 'bg-brand-soft text-brand'}`}>{icon}</div>}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">{value}</div>
      {(sub || live) && (
        <div className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${accent ? 'opacity-85' : 'text-muted'}`}>
          {sub}
          {live && <span className={`rounded-full px-1.5 py-0.5 font-semibold ${accent ? 'bg-white/20' : 'bg-success-soft text-success'}`}>{live}</span>}
        </div>
      )}
    </div>
  )
}
