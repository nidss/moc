import { useI18n } from '../i18n/I18nProvider'
import { ZONES } from '../data/zones'
import { EXHIBITORS } from '../data/exhibitors'

export function FloorPlanMap({ selected, onSelect, compact = false }: { selected?: string; onSelect?: (id: string) => void; compact?: boolean }) {
  const { L } = useI18n()
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface p-2 sm:p-3">
      <svg viewBox="0 0 1000 600" className="h-auto w-full" role="img" aria-label="Floor plan">
        <rect x="0" y="0" width="1000" height="600" rx="16" fill="var(--surface-2)" />
        {ZONES.map((z) => {
          const isSel = selected === z.id
          const dim = selected && !isSel
          const booths = z.pavilion ? EXHIBITORS.filter((e) => e.pavilion === z.pavilion) : []
          const cols = Math.max(1, Math.floor((z.w - 20) / 34))
          return (
            <g key={z.id} onClick={onSelect ? () => onSelect(z.id) : undefined}
              className={onSelect ? 'cursor-pointer' : ''} opacity={dim ? 0.45 : 1}
              role={onSelect ? 'button' : undefined} aria-label={L(z.label)} tabIndex={onSelect ? 0 : undefined}
              onKeyDown={onSelect ? (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(z.id) : undefined}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="12" fill={z.color} fillOpacity={isSel ? 0.95 : 0.85}
                stroke={isSel ? '#f5a300' : 'transparent'} strokeWidth="5" />
              {z.w < 200 ? (
                // โซนแคบ: แยกคำขึ้นบรรทัดใหม่เพื่อไม่ให้ข้อความล้นกรอบ
                <text x={z.x + 12} y={z.y + 26} fill="#fff" fontSize={compact ? 17 : 15} fontWeight="700">
                  {L(z.label).split(/\s+/).map((w, i) => <tspan key={i} x={z.x + 12} dy={i ? 19 : 0}>{w}</tspan>)}
                </text>
              ) : (
                <text x={z.x + 14} y={z.y + 28} fill="#fff" fontSize={compact ? 20 : 17} fontWeight="700">{L(z.label)}</text>
              )}
              {!compact && z.h > 100 && z.w >= 200 && (
                <text x={z.x + 14} y={z.y + 50} fill="#ffffffcc" fontSize="13">{L(z.desc).slice(0, 34)}</text>
              )}
              {booths.map((b, i) => (
                <rect key={b.id} x={z.x + 14 + (i % cols) * 34} y={z.y + (compact ? 50 : 66) + Math.floor(i / cols) * 30} width="28" height="22" rx="4"
                  fill="#ffffff" fillOpacity="0.85" />
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
