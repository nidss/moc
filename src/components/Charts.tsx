import type { ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from './ui/Card'

// โทเคนของกราฟอ้างอิงจาก CSS variables เพื่อให้สลับ light/dark อัตโนมัติ
export const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)']
const AXIS = { fontSize: 12, fill: 'var(--muted)' }

export function ChartCard({ title, subtitle, children, action, className = '' }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <Card className={`p-4 sm:p-5 ${className}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-bold">{title}</div>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}

type TipProps = {
  active?: boolean
  label?: string | number
  payload?: { name?: string; value?: number; color?: string; dataKey?: string | number }[]
  format: (v: number) => string
  labelFormat?: (l: string) => string
}

function Tip({ active, payload, label, format, labelFormat }: TipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-semibold text-fg">{labelFormat ? labelFormat(String(label)) : label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2 text-muted">
          <span className="size-2.5 rounded-sm" style={{ background: p.color }} />
          {payload.length > 1 && <span>{p.name}</span>}
          <span className="ml-auto font-semibold tabular-nums text-fg">{format(Number(p.value))}</span>
        </div>
      ))}
    </div>
  )
}

type Row = Record<string, string | number>

export function TrendArea({ data, x, y, name, format, labelFormat, tickFormat, height = 240 }: { data: Row[]; x: string; y: string; name: string; format: (v: number) => string; labelFormat?: (l: string) => string; tickFormat?: (l: string) => string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--grid)" />
        <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={{ stroke: 'var(--line)' }} tickFormatter={tickFormat} minTickGap={24} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip content={<Tip format={format} labelFormat={labelFormat} />} cursor={{ stroke: 'var(--muted)', strokeDasharray: '3 3' }} />
        <Area type="monotone" dataKey={y} name={name} stroke="var(--series-1)" strokeWidth={2} fill="url(#area-fill)" activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MultiLine({ data, x, series, format, height = 240 }: { data: Row[]; x: string; series: { key: string; name: string }[]; format: (v: number) => string; height?: number }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-muted">
        {series.map((s, i) => (
          <span key={s.key} className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: SERIES[i] }} /> {s.name}</span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={{ stroke: 'var(--line)' }} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
          <Tooltip content={<Tip format={format} />} cursor={{ stroke: 'var(--muted)', strokeDasharray: '3 3' }} />
          {series.map((s, i) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={SERIES[i]} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ColumnBars({ data, x, y, name, format, height = 240 }: { data: Row[]; x: string; y: string; name: string; format: (v: number) => string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke="var(--grid)" />
        <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={{ stroke: 'var(--line)' }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip content={<Tip format={format} />} cursor={{ fill: 'var(--surface-2)' }} />
        <Bar dataKey={y} name={name} fill="var(--series-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** แท่งแนวนอนแบบ HTML — อ่านป้ายภาษาไทยยาว ๆ ได้ดีกว่า SVG */
export function HBarList({ rows, format, max }: { rows: { label: string; value: number; sub?: string }[]; format: (v: number) => string; max?: number }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1)
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="group" title={`${r.label}: ${format(r.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{format(r.value)}{r.sub && <span className="ml-1 text-xs font-normal text-muted">{r.sub}</span>}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-[var(--series-1)] transition-[width] group-hover:brightness-110" style={{ width: `${(r.value / top) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
