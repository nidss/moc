import { useId, useMemo, useRef, useState, type SVGProps } from 'react'
import { Minus, Plus, RotateCcw, Move } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { HALL, HUB_PAVILIONS, PARTNER_BLOCKS, TASTE_AREAS, VIEW, WALKWAY, ZONES, type HubPavilion, type Rect } from '../data/zones'
import { useExhibitors } from '../store/selectors'

// ผังจริง Hall 7–8 วาดใหม่เป็นเวกเตอร์มุมบน พิกัดทั้งหมดมาจาก src/data/zones.ts
const FLOOR = '#eceff2'
const INK = '#22394d'
const GREEN = '#5f9b6d'
const NAVY = '#1e3a8a'
const CX = VIEW.x + VIEW.w / 2
const CY = VIEW.y + VIEW.h / 2

const R = ({ x, y, w, h, r }: Rect, props: SVGProps<SVGRectElement> = {}) =>
  <rect x={x} y={y} width={w} height={h} rx={r} {...props} />

/** แถวบูธ: n ช่องเรียงตามแนว dir ช่องที่มีร้านจะระบายสีและแสดงรหัสบูธ */
function Cells({ x, y, w, h, n, dir, color, codes = [] }: { x: number; y: number; w: number; h: number; n: number; dir: 'h' | 'v'; color: string; codes?: string[] }) {
  const step = (dir === 'h' ? w : h) / n
  return <g>{Array.from({ length: n }, (_, i) => {
    const cx = dir === 'h' ? x + i * step : x
    const cy = dir === 'h' ? y : y + i * step
    const cw = dir === 'h' ? step : w
    const ch = dir === 'h' ? h : step
    const code = codes[i]
    return <g key={i}>
      <rect x={cx + 1.5} y={cy + 1.5} width={cw - 3} height={ch - 3} rx="2" fill={code ? color : '#f7f2e6'} stroke="#fff" strokeWidth="1.6" />
      {code
        ? <text x={cx + cw / 2} y={cy + ch / 2 + 3} textAnchor="middle" fontSize={Math.min(8.5, (cw - 3) / 3.1)} fontWeight="800" fill="#fff">{code}</text>
        : <rect x={cx + cw / 2 - 4} y={cy + ch / 2 - 4} width="8" height="8" rx="1" fill="none" stroke="#cdbf9f" />}
    </g>
  })}</g>
}

function Counter({ p, color }: { p: HubPavilion; color: string }) {
  const { x, y, w, h } = p.rect
  const d = p.counter === 'right' ? `M${x + w} ${y + 52} a18 18 0 0 1 0 36 z`
    : p.counter === 'left' ? `M${x} ${y + 52} a18 18 0 0 0 0 36 z`
    : `M${x + w / 2 - 18} ${y + h} a18 18 0 0 0 36 0 z`
  return <path d={d} fill="#d4f0fc" stroke={color} strokeOpacity=".5" />
}

function HubPavilionArt({ p, color, codes, abbr }: { p: HubPavilion; color: string; codes: string[]; abbr: string }) {
  const { x, y, w, h } = p.rect
  const name = `Pavilion ${p.no}`
  if (p.layout === 'h') return <g>
    <Counter p={p} color={color} />
    <text x={x + w / 2} y={y + 32} textAnchor="middle" fontSize="23" fontWeight="800" fill={color}>{abbr}</text>
    <Cells x={x + 8} y={y + 44} w={w - 16} h={52} n={7} dir="h" color={color} codes={codes} />
    <text x={x + w / 2} y={y + h - 13} textAnchor="middle" fontSize="20" fontWeight="700" fill={INK}>{name}</text>
  </g>
  if (p.layout === 'v') return <g>
    <Counter p={p} color={color} />
    <Cells x={x + w / 2 - 26} y={y + 8} w={52} h={h - 16} n={8} dir="v" color={color} codes={codes} />
    <text x={x + w - 25} y={y + h / 2 + 8} textAnchor="middle" fontSize={abbr.length > 3 ? 16 : 20} fontWeight="800" fill={color}>{abbr}</text>
    <text x={x + w / 2} y={y + h + 46} textAnchor="middle" fontSize="23" fontWeight="700" fill={INK}>{name}</text>
  </g>
  return <g>
    <Counter p={p} color={color} />
    <Cells x={x + 72} y={y + 8} w={52} h={h - 16} n={8} dir="v" color={color} codes={codes.slice(0, 8)} />
    <Cells x={x + w - 124} y={y + 8} w={52} h={h - 16} n={8} dir="v" color={color} codes={codes.slice(8)} />
    {abbr !== p.agency && <text x={x + w / 2} y={y + 42} textAnchor="middle" fontSize="22" fontWeight="800" fill={INK}>{p.agency}</text>}
    <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>{abbr}</text>
    <text x={x + w / 2} y={y - 12} textAnchor="middle" fontSize="23" fontWeight="700" fill={INK}>{name}</text>
  </g>
}

/** โซน MOC TASTE หนึ่งฝั่ง: ลานนั่งพักด้านบน + บูธอาหาร 4 แถวคู่ */
function TasteArt({ area, color, codes }: { area: Rect; color: string; codes: string[] }) {
  const { x, y, w } = area
  const cols = [30, 108, 185, 263]
  return <g>
    <rect x={x + 30} y={y + 18} width={w - 60} height={92} rx="16" fill={GREEN} />
    {Array.from({ length: 21 }, (_, i) => <circle key={i} cx={x + 58 + (i % 7) * 38} cy={y + 38 + Math.floor(i / 7) * 27} r="7" fill="#fff" fillOpacity=".9" />)}
    <text x={x + w / 2} y={y + 106} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" letterSpacing="1">REST AREA</text>
    {cols.map((cx, c) => <g key={cx}>
      <Cells x={x + cx} y={y + 141} w={25} h={264} n={8} dir="v" color={color} codes={codes.slice(c * 16, c * 16 + 8)} />
      <Cells x={x + cx + 25} y={y + 141} w={25} h={264} n={8} dir="v" color={color} codes={codes.slice(c * 16 + 8, c * 16 + 16)} />
    </g>)}
    <rect x={x + w / 2 - 52} y={y + 412} width="104" height="5" rx="2" fill="#2563eb" />
  </g>
}

function Garden({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  return <g transform={flip ? `translate(${2 * x + 111} 0) scale(-1 1)` : undefined}>
    <rect x={x} y={y} width="111" height="176" rx="48" fill={GREEN} />
    <path d={`M${x + 22} ${y + 70} q 28 -42 70 -36`} stroke="#d9f2ff" strokeWidth="8" fill="none" strokeLinecap="round" />
    {[[30, 118], [58, 104], [78, 132], [44, 150]].map(([dx, dy], i) => <rect key={i} x={x + dx - 9} y={y + dy - 9} width="18" height="18" rx="3" fill="#fff" stroke={NAVY} strokeWidth="1.5" />)}
    <circle cx={x + 18} cy={y + 26} r="7" fill="#fff" />
  </g>
}

export function FloorPlanMap({ selected, onSelect, compact = false }: { selected?: string; onSelect?: (id: string) => void; compact?: boolean }) {
  const { tr, L, lang } = useI18n()
  const uid = useId().replace(/:/g, '')
  const exhibitors = useExhibitors()
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef({ x: 0, y: 0, px: 0, py: 0, active: false, moved: false })
  const clamp = (p: { x: number; y: number }, z: number) => ({
    x: Math.max(-(z - 1) * VIEW.w / 2, Math.min((z - 1) * VIEW.w / 2, p.x)),
    y: Math.max(-(z - 1) * VIEW.h / 2, Math.min((z - 1) * VIEW.h / 2, p.y)),
  })
  const changeZoom = (value: number) => { setZoom(value); setPan((p) => clamp(p, value)) }
  const selectedZone = ZONES.find((z) => z.id === selected)
  const choose = (id: string) => { if (!drag.current.moved) onSelect?.(id) }
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // รหัสบูธของร้านที่วางลงในผัง: MOC HUB แยกตามหน่วยงาน, MOC TASTE เรียงจากฝั่งซ้าย
  const codes = useMemo(() => {
    const byAgency: Record<string, string[]> = {}
    const taste: string[] = []
    for (const e of exhibitors) {
      if (e.pavilion === 'hub' && e.agency) (byAgency[e.agency] ??= []).push(e.booth)
      if (e.pavilion === 'taste') taste.push(e.booth)
    }
    return { byAgency, taste }
  }, [exhibitors])
  const hub = ZONES.find((z) => z.id === 'hub')!
  const taste = ZONES.find((z) => z.id === 'taste')!

  return (
    <div className="overflow-hidden rounded-2xl border border-[#263c59] bg-[#0c1b32] text-white shadow-xl shadow-navy/10">
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-white/10 ${compact ? 'px-4 py-3' : 'px-5 py-4 sm:px-6'}`}>
        <div>
          <div className="text-[10px] font-bold tracking-[.22em] text-[#c9a567]">MOC EXPO 2026 · VENUE GUIDE</div>
          <div className="mt-1 text-sm font-semibold tracking-wide sm:text-base">QSNCC <span className="mx-2 text-white/25">/</span> HALL 7–8</div>
        </div>
        {!compact && <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1">
          <button type="button" onClick={() => changeZoom(Math.max(1, zoom - .25))} disabled={zoom === 1} aria-label={tr('ซูมออก', 'Zoom out')} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-30"><Minus size={15} /></button>
          <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => changeZoom(Math.min(3, zoom + .25))} disabled={zoom === 3} aria-label={tr('ซูมเข้า', 'Zoom in')} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-30"><Plus size={15} /></button>
          <span className="mx-1 h-4 w-px bg-white/15" />
          <button type="button" onClick={reset} aria-label={tr('แสดงผังทั้งหมด', 'Reset map view')} className="rounded-lg p-2 hover:bg-white/10"><RotateCcw size={14} /></button>
        </div>}
      </div>

      <div className="flex items-start justify-center gap-6 p-2 sm:p-5">
        <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          className={`block h-auto w-full min-w-0 select-none ${compact ? 'max-w-[520px]' : 'max-w-[min(100%,calc(84vh*0.81))]'} ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }} role="group" aria-labelledby={`${uid}-title ${uid}-desc`}
          onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, active: zoom > 1, moved: false } }}
          onPointerMove={(e) => {
            const s = drag.current
            if (!s.active) return
            const dx = e.clientX - s.x, dy = e.clientY - s.y
            if (Math.abs(dx) + Math.abs(dy) < 5) return
            s.moved = true
            e.currentTarget.setPointerCapture(e.pointerId)
            const box = e.currentTarget.getBoundingClientRect()
            const ratio = Math.max(VIEW.w / box.width, VIEW.h / box.height)
            setPan(clamp({ x: s.px + dx * ratio, y: s.py + dy * ratio }, zoom))
          }}
          onPointerUp={(e) => { drag.current.active = false; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) }}
          onPointerCancel={() => { drag.current.active = false }}>
          <title id={`${uid}-title`}>{tr('ผังพื้นที่จัดงาน MOC Expo 2026 Hall 7–8', 'MOC Expo 2026 floor plan, Hall 7–8')}</title>
          <desc id={`${uid}-desc`}>{tr('ผังตามแบบจริง Zone 1–8 และ Pavilion 1–10 เลือกโซนเพื่อดูรายละเอียด ทางเข้าอยู่ที่ Hall 7 ด้านล่าง', 'Based on the actual layout with Zones 1–8 and Pavilions 1–10. Select a zone for details. The entrance is at Hall 7, at the bottom.')}</desc>
          <defs>
            <pattern id={`${uid}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#fff" opacity=".06" /></pattern>
            <filter id={`${uid}-shadow`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14" /></filter>
          </defs>
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="#0f2240" />
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={`url(#${uid}-dots)`} />

          <g transform={`translate(${pan.x} ${pan.y}) translate(${CX} ${CY}) scale(${zoom}) translate(${-CX} ${-CY})`}>
            {/* พื้นและผนัง Hall, ทางเข้า Hall 7 และทางออก Hall 8 */}
            <g pointerEvents="none">
              {R(HALL, { fill: '#000', opacity: .5, filter: `url(#${uid}-shadow)`, transform: 'translate(0 14)' })}
              <rect x={VIEW.x} y={HALL.y + HALL.h} width={VIEW.w} height="170" fill="#b9c4cf" />
              <rect x={425} y={HALL.y + HALL.h} width={207} height="170" fill="#d7dee5" />
              <rect x={1118} y={HALL.y + HALL.h} width={220} height="170" fill="#d7dee5" />
              <rect x={VIEW.x} y={1740} width={VIEW.w} height="110" fill="#cfd7df" />
              {R(HALL, { fill: FLOOR, stroke: '#9fb0c0', strokeWidth: 6 })}
              {[532, 880, 1228].map((y) => <rect key={y} x={HALL.x - 16} y={y} width="13" height="22" fill="#30455d" />)}
              <path d="M528 1712 V1650 M512 1668 L528 1650 L544 1668" stroke="#b28a42" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M1228 1650 V1712 M1212 1694 L1228 1712 L1244 1694" stroke="#64748b" strokeWidth="5" fill="none" strokeLinecap="round" />
              <text x={528} y={1735} textAnchor="middle" fontSize="17" fontWeight="800" fill="#8c6d33" letterSpacing="1">ENTRANCE · HALL 7</text>
              <text x={1228} y={1638} textAnchor="middle" fontSize="17" fontWeight="800" fill="#475569" letterSpacing="1">EXIT · HALL 8</text>
              {R(WALKWAY, { fill: NAVY, r: 26 })}
              <circle cx={850} cy={648} r="24" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />
              <text x={850} y={651} textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">LANDMARK</text>
              <circle cx={850} cy={1350} r="102" fill={NAVY} />
              <circle cx={850} cy={1037} r="25" fill="#cdeefd" stroke="#fff" strokeWidth="2" />
              <text x={850} y={1040} textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY}>Hologram</text>
              {[770, 925].map((x, i) => <g key={x}><circle cx={x} cy={1117} r="37" fill="#d9caa4" stroke="#fff" strokeWidth="2" /><text x={x} y={1121} textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b4a26">Showcase {i + 1}</text></g>)}
              <Garden x={697} y={1137} /><Garden x={892} y={1137} flip />
              <Garden x={697} y={1382} /><Garden x={892} y={1382} flip />
              {[398, 1302].map((x) => <text key={x} x={x} y={699} textAnchor="middle" fontSize="12" fontWeight="600" fill="#64748b" letterSpacing=".5">LANDMARK · ARCHWAY</text>)}
            </g>

            {/* พื้นที่โซนที่คลิกได้ */}
            {ZONES.map((z) => {
              const active = selected === z.id
              return <g key={z.id} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} aria-label={L(z.label)} aria-pressed={onSelect ? active : undefined}
                onClick={() => choose(z.id)} onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(z.id) } } : undefined}
                className={onSelect ? 'floor-zone cursor-pointer focus:outline-none' : ''}>
                <title>{L(z.label)} — {L(z.desc)}</title>
                {z.shapes.map((s, i) => <g key={i}>
                  {R(s, { className: z.kind === 'rest' ? 'zone-solid' : 'zone-shape', fill: z.color, fillOpacity: z.kind === 'rest' ? .9 : active ? .34 : .17, stroke: active ? '#e2a93b' : z.color, strokeOpacity: active ? 1 : .45, strokeWidth: active ? 6 : 1.5 })}
                  {R({ ...s, x: s.x - 4, y: s.y - 4, w: s.w + 8, h: s.h + 8, r: s.r ? s.r + 4 : 4 }, { className: 'zone-focus', fill: 'none', stroke: '#fff', strokeWidth: 3, opacity: 0 })}
                </g>)}
              </g>
            })}

            {/* รายละเอียดในโซน (ไม่รับคลิก เพื่อให้คลิกทะลุไปที่โซนด้านล่าง) */}
            <g pointerEvents="none">
              {HUB_PAVILIONS.map((p) => <HubPavilionArt key={p.no} p={p} color={hub.color} codes={codes.byAgency[p.agency] ?? []} abbr={lang === 'th' ? p.abbr : p.agency} />)}
              {TASTE_AREAS.map((a, i) => <TasteArt key={i} area={a} color={taste.color} codes={i === 0 ? codes.taste : []} />)}

              {/* Pavilion 10 ศูนย์ให้คำปรึกษา */}
              <circle cx={850} cy={1350} r="80" fill="none" stroke="#cdeefd" strokeWidth="9" strokeDasharray="95 31" strokeDashoffset="20" opacity=".9" />
              <circle cx={850} cy={1350} r="62" fill="#e3f5fd" stroke="#c9a567" strokeWidth="5" />
              <text x={850} y={1330} textAnchor="middle" fontSize="17" fontWeight="700" fill={INK}>Pavilion</text>
              <text x={850} y={1352} textAnchor="middle" fontSize="19" fontWeight="800" fill={INK}>10</text>
              <text x={850} y={1372} textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>{tr('บริการให้คำปรึกษา', 'Business')}</text>
              <text x={850} y={1386} textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>{tr('ธุรกิจ', 'Advisory')}</text>
              <text x={850} y={1442} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="1">LANDMARK</text>

              {/* Partner Pavilion */}
              {PARTNER_BLOCKS.map((b) => <g key={b.name}>
                {R(b.rect, { fill: b.fill, stroke: '#93a9c4', strokeWidth: 1.2 })}
                <text x={b.rect.x + b.rect.w / 2} y={b.rect.y + b.rect.h / 2 + (b.rect.w < 50 ? 0 : 2)} textAnchor="middle" fontSize={b.rect.w < 50 ? 7.5 : 12} fontWeight="700" fill={INK}>{b.name}</text>
                {b.rect.w >= 50 && <text x={b.rect.x + b.rect.w / 2} y={b.rect.y + b.rect.h / 2 + 15} textAnchor="middle" fontSize="8.5" fill="#64748b">{tr(`${b.size} ตร.ม.`, `${b.size} m²`)}</text>}
              </g>)}

              {/* Zone 2 เวที MOC UP SKILL และที่นั่ง */}
              <rect x={686} y={210} width={328} height={63} rx="3" fill={NAVY} />
              <path d="M700 238 Q850 205 1000 238" stroke="#3b82f6" strokeWidth="3" fill="none" />
              <circle cx={850} cy={268} r="46" fill="#d8c59c" stroke="#fff" strokeWidth="4" />
              <text x={850} y={273} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} letterSpacing="1">STAGE</text>
              {Array.from({ length: 28 }, (_, i) => <rect key={i} x={750 + (i % 14) * 14.5} y={410 + Math.floor(i / 14) * 20} width="10" height="12" rx="2" fill="#fff" stroke="#94a3b8" />)}
              {[458, 470].map((y) => <rect key={y} x={730} y={y} width={243} height="7" rx="1.5" fill="#1f2937" />)}
              {Array.from({ length: 7 }, (_, i) => [714, 862].map((x) => <rect key={`${x}-${i}`} x={x} y={497 + i * 11} width={123} height="6" rx="1.5" fill="#1f2937" />))}
              <rect x={916} y={596} width={70} height={18} rx="3" fill="#fff" stroke="#94a3b8" />
              {[0, 1, 2, 3].map((i) => <rect key={i} x={922 + i * 16} y={600} width="10" height="7" fill="#334155" />)}
              <text x={951} y={628} textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">REGISTRATION</text>

              {/* Rest Area ข้างเวที */}
              {[616, 1086].map((x) => <g key={x}>
                {[392, 440, 552, 580].map((y) => <rect key={y} x={x - 6} y={y - 6} width="12" height="12" rx="2" fill="#fff" />)}
                {[340, 640].map((y) => <circle key={y} cx={x} cy={y} r="14" fill="#2f6b44" />)}
                <text x={x} y={490} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff">REST AREA</text>
              </g>)}

              {/* Zone 4 / 5 / 7: โต๊ะกิจกรรม */}
              {[730, 822].flatMap((y) => [0, 1, 2].map((i) => <rect key={`${y}-${i}`} x={242 + i * 76} y={y} width="66" height="22" rx="4" fill="#fff" stroke="#15803d" strokeOpacity=".5" />))}
              {[736, 826].flatMap((y) => [0, 1, 2].map((i) => <g key={`${y}-${i}`}><rect x={1240 + i * 76} y={y} width="56" height="16" rx="4" fill="#fff" stroke="#5b21b6" strokeOpacity=".5" />{[-1, 1].map((s) => <circle key={s} cx={1268 + i * 76} cy={y + 8 + s * 14} r="4.5" fill="#5b21b6" fillOpacity=".55" />)}</g>))}
              <rect x={1250} y={1000} width="70" height="26" rx="4" fill="#fff" stroke="#be123c" strokeOpacity=".5" />
              <circle cx={1400} cy={1013} r="11" fill="#be123c" fillOpacity=".7" /><circle cx={1400} cy={1013} r="4" fill="#fff" />

              {/* Zone 8 จุดประชาสัมพันธ์ และพื้นที่หน้าทางเข้า */}
              <rect x={204} y={1418} width="20" height="106" rx="3" fill="#fff" stroke="#8a6a1f" strokeOpacity=".6" />
              <rect x={188} y={1760} width="110" height="22" rx="4" fill="#fff" stroke="#8a6a1f" strokeOpacity=".6" />
              <rect x={345} y={1766} width="78" height="7" rx="2" fill="#1d4ed8" />
              <rect x={477} y={1762} width="102" height="12" rx="2" fill="#c9a567" />
              <rect x={605} y={1748} width="150" height="44" rx="22" fill={NAVY} />
              {[['REGISTRATION', 243], ['DIRECTORY', 384], ['ARCHWAY', 528], ['BACKDROP', 680]].map(([t, x]) => <text key={t} x={x} y={1826} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} letterSpacing=".5">{t}</text>)}
            </g>

            {/* ป้ายชื่อโซน (คลิกได้) */}
            {ZONES.flatMap((z) => z.tags.map(([px, py], i) => {
              const active = z.id === selected
              const label = z.mapLabel ?? ''
              const width = Math.max(130, label.length * 10.4 + 62)
              return <g key={`${z.id}-${i}`} transform={`translate(${px} ${py})`} onClick={() => choose(z.id)} className={onSelect ? 'cursor-pointer' : ''} aria-hidden="true">
                <rect x={-width / 2 + 2} y={-17} width={width} height="40" rx="20" fill="#0b1a30" opacity=".18" />
                <rect x={-width / 2} y={-20} width={width} height="40" rx="20" fill={active ? z.color : '#fff'} stroke={active ? '#e2a93b' : '#c9d5e0'} strokeWidth={active ? 3 : 1.2} />
                <circle cx={-width / 2 + 21} cy={0} r="15" fill={active ? '#ffffff30' : z.color} />
                <text x={-width / 2 + 21} y={5.5} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800">{z.code}</text>
                <text x={-width / 2 + 44} y={5.5} fill={active ? '#fff' : INK} fontSize="15.5" fontWeight="800" letterSpacing=".4">{label}</text>
              </g>
            }))}
          </g>
        </svg>

        {/* คำอธิบายโซนข้างผัง (จอกว้าง) */}
        {!compact && <ol className="hidden w-56 shrink-0 space-y-1 lg:block">
          {ZONES.map((z) => {
            const active = z.id === selected
            return <li key={z.id}>
              <button type="button" onClick={() => onSelect?.(z.id)} aria-pressed={active}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${active ? 'bg-white/12 text-white' : 'text-[#b9c8d9] hover:bg-white/6 hover:text-white'}`}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: z.color }}>{z.code}</span>
                <span className="min-w-0 flex-1 leading-snug">{L(z.label)}</span>
              </button>
            </li>
          })}
          <li className="pt-3 text-[11px] leading-relaxed text-[#8ea3ba]">
            {tr(`MOC HUB มี ${HUB_PAVILIONS.length + 2} Pavilion: Pavilion 1–9 ของหน่วยงาน, Pavilion 10 ให้คำปรึกษา และ Partner Pavilion`, `MOC HUB has ${HUB_PAVILIONS.length + 2} pavilions: agency Pavilions 1–9, Pavilion 10 advisory and the Partner Pavilion`)}
          </li>
        </ol>}
      </div>

      {!compact && <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[.025] px-5 py-3 text-[11px] sm:px-6">
        <span className="flex items-center gap-2 text-[#b2c3d6]"><Move size={13} />{tr('ซูมแล้วลากเพื่อสำรวจพื้นที่', 'Zoom in and drag to explore')}</span>
        <span className="flex items-center gap-2 text-[#e5c38c]"><span className="size-1.5 rounded-full bg-[#e5c38c]" />{selectedZone ? L(selectedZone.label) : tr('เลือกโซนบนผัง', 'Select a zone')}</span>
      </div>}
      <style>{`.floor-zone:hover .zone-shape{fill-opacity:.3}.floor-zone:hover .zone-solid{opacity:.8}.floor-zone:focus-visible .zone-focus{opacity:1}`}</style>
    </div>
  )
}
