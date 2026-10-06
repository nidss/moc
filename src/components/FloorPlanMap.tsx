import { useId, useRef, useState } from 'react'
import { Minus, Plus, RotateCcw, Move } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { ZONES, type Zone } from '../data/zones'
import { EXHIBITORS } from '../data/exhibitors'

// Architectural cutaway: keep the shared zone coordinates and project them into 2.5D.
const project = (x: number, y: number, z = 0) => [565 + x * .72 - y * .62, 118 + x * .32 + y * .36 - z]
const point = (x: number, y: number, z = 0) => project(x, y, z).join(',')
const plane = (z = 0) => `matrix(.72 .32 -.62 .36 565 ${118 - z})`
const footprint = (x: number, y: number, w: number, d: number, z = 0) => [point(x,y,z), point(x+w,y,z), point(x+w,y+d,z), point(x,y+d,z)].join(' ')
const LABELS: Record<string, [string, string]> = {
  hub: ['MOC HUB', 'SME EXHIBITION'], upskill: ['MOC UP SKILL', 'MAIN STAGE'], taste: ['MOC TASTE', 'FOOD & DRINK'],
  consult: ['ADVISORY', 'BUSINESS SUPPORT'], private: ['PRIVATE PAVILION', 'PARTNERS & SERVICES'],
  matching: ['BUSINESS MATCHING', 'MEETING LOUNGE'], workshop: ['WORKSHOP', 'HANDS-ON ACTIVITIES'],
  registration: ['REGISTRATION', 'MAIN ENTRANCE'], rest: ['REST AREA', 'SEATING & CHARGING'],
}

function Box({ x, y, w, d, h, z = 0, top = '#ffffff', front = '#d9e1e8', side = '#b3c1cf' }: { x: number; y: number; w: number; d: number; h: number; z?: number; top?: string; front?: string; side?: string }) {
  return <g stroke="#243b5314" strokeWidth=".6" strokeLinejoin="round">
    <polygon points={[point(x+w,y,z),point(x+w,y+d,z),point(x+w,y+d,z+h),point(x+w,y,z+h)].join(' ')} fill={side} />
    <polygon points={[point(x,y+d,z),point(x+w,y+d,z),point(x+w,y+d,z+h),point(x,y+d,z+h)].join(' ')} fill={front} />
    <polygon points={footprint(x,y,w,d,z+h)} fill={top} />
  </g>
}

function Booth({ x, y, w = 54, d = 43, color, code }: { x: number; y: number; w?: number; d?: number; color: string; code?: string }) {
  const [tx,ty] = project(x+w/2,y+3,32)
  return <g>
    <polygon points={footprint(x+4,y+7,w+3,d+3)} fill="#14294112" />
    <Box x={x} y={y} w={w} d={d} h={3} top="#f8f5ee" />
    <Box x={x} y={y} w={w} d={3} h={31} top="#fff" front="#e7edf2" side="#a5b6c9" />
    <Box x={x} y={y} w={3} d={d} h={31} top="#fff" front="#ced8e3" side="#eef2f7" />
    <Box x={x+3} y={y+1} w={w-3} d={3} h={7} z={29} top={color} front={color} side={color} />
    <Box x={x+w-23} y={y+d-12} w={21} d={10} h={14} top="#fff" front={color} side="#bac9d6" />
    <Box x={x+11} y={y+12} w={18} d={7} h={12} top="#fff" front="#d7e1e8" />
    {code && <text x={tx} y={ty} textAnchor="middle" fontSize="7" fontWeight="800" fill="white">{code}</text>}
  </g>
}

function Table({x,y,w=50,d=24,color='#b68952'}:{x:number;y:number;w?:number;d?:number;color?:string}) {
  return <g>
    <polygon points={footprint(x+3,y+3,w+3,d+5)} fill="#14294110" />
    {[0,w-3].flatMap(dx=>[0,d-3].map(dy=><Box key={`${dx}-${dy}`} x={x+dx} y={y+dy} w={3} d={3} h={13} top="#667889" front="#718396" side="#4b5f73" />))}
    <Box x={x} y={y} w={w} d={d} h={3} z={13} top="#f2e3c8" front={color} side={color} />
    {[10,w-17].flatMap(dx=>[-12,d+4].map(dy=><Box key={`${dx}-${dy}`} x={x+dx} y={y+dy} w={9} d={9} h={8} top="#ffffff" front="#a7b8c8" side="#7d91a5" />))}
  </g>
}

function Plant({x,y}:{x:number;y:number}) {
  const [px,py]=project(x,y,12)
  return <g><Box x={x-5} y={y-5} w={10} d={10} h={10} top="#73935b" front="#c8d3d8" side="#93a6b1" />
    <ellipse cx={px-3} cy={py-5} rx={5} ry={8} fill="#4a8368" /><ellipse cx={px+4} cy={py-7} rx={5} ry={9} fill="#6c9b74" />
    <ellipse cx={px} cy={py-10} rx={4} ry={8} fill="#91b88b" /></g>
}

function Furnishings({zone}:{zone:Zone}) {
  const {x,y,w,h,color,id}=zone
  if (id==='hub' || id==='private' || id==='taste') {
    const booths=EXHIBITORS.filter(e=>e.pavilion===zone.pavilion)
    const cols=id==='hub'?6:id==='taste'?3:2
    const bw=id==='hub'?55:id==='taste'?49:69
    const depth=id==='private'?53:42
    return <>{booths.map((b,i)=><Booth key={b.id} x={x+17+(i%cols)*(bw+19)} y={y+68+Math.floor(i/cols)*(depth+21)} w={bw} d={depth} color={color} code={b.booth} />)}
      {id==='taste' && [0,1].map(i=><Table key={i} x={x+26+i*91} y={y+204} w={51} d={19} color="#c17e43" />)}
    </>
  }
  if(id==='consult') return <>{Array.from({length:8},(_,i)=><Booth key={i} x={x+20+(i%4)*50} y={y+70+Math.floor(i/4)*68} w={38} d={45} color={color} />)}</>
  if(id==='upskill') return <>
    <Box x={x+23} y={y+61} w={w-46} d={58} h={15} top="#21479a" front="#13316d" side="#0d2657" />
    <Box x={x+29} y={y+62} w={w-58} d={5} h={46} z={15} top="#809dec" front="#163573" side="#123064" />
    <g transform={plane(42)}><rect x={x+66} y={y+66} width={104} height={3} fill="#e8bc67" /></g>
    <Box x={x+51} y={y+85} w={15} d={13} h={23} z={15} top="#fff" front="#d4dfef" />
    {[0,1,2].map(i=><Box key={i} x={x+w/2-18} y={y+118+i*6} w={36} d={6} h={12-i*4} top="#e0e7f3" front="#9baec7" />)}
    {Array.from({length:32},(_,i)=><Box key={i} x={x+28+(i%8)*23} y={y+156+Math.floor(i/8)*20} w={12} d={11} h={8} top="#8da9df" front="#436aaa" side="#32548a" />)}
  </>
  if(id==='workshop') return <>
    <Box x={x+22} y={y+52} w={w-44} d={15} h={17} top="#f6e9cc" front="#59956e" side="#3b7757" />
    {Array.from({length:6},(_,i)=><Table key={i} x={x+24+(i%2)*100} y={y+94+Math.floor(i/2)*41} w={70} d={21} color="#8eaa83" />)}
  </>
  if(id==='matching') return <>{Array.from({length:6},(_,i)=><Table key={i} x={x+24+(i%2)*102} y={y+77+Math.floor(i/2)*48} w={67} d={23} color="#8d79b0" />)}</>
  if(id==='registration') return <>
    {[0,1,2,3].map(i=><Box key={i} x={x+80+i*55} y={y+22} w={46} d={18} h={18} top="#f6e2b9" front="#b69350" side="#8e703a" />)}
    {[0,1,2].map(i=><Box key={i} x={x+412+i*48} y={y+24} w={8} d={21} h={19} top="#70a9b4" front="#d8e4ea" side="#a3bbc6" />)}
  </>
  return <>
    {[0,1,2].map(i=><Box key={i} x={x+24+i*67} y={y+29} w={42} d={17} h={11} top="#9caeb8" front="#687e8b" side="#536b79" />)}
    <Plant x={x+14} y={y+h-12} /><Plant x={x+w-15} y={y+22} />
  </>
}

// Painter's order keeps furniture at the front of the hall in front of distant furniture.
const ORDERED_ZONES=[...ZONES].sort((a,b)=>(a.x+a.y)-(b.x+b.y))

export function FloorPlanMap({ selected, onSelect, compact = false }: { selected?: string; onSelect?: (id: string) => void; compact?: boolean }) {
  const { tr, L } = useI18n()
  const uid=useId().replace(/:/g,'')
  const [zoom,setZoom]=useState(1)
  const [pan,setPan]=useState({x:0,y:0})
  const drag=useRef({x:0,y:0,px:0,py:0,active:false,moved:false})
  const changeZoom=(value:number)=>{
    const limit=(value-1)*650
    setZoom(value)
    setPan(current=>({
      x:Math.max(-limit,Math.min(limit,current.x)),
      y:Math.max(-limit,Math.min(limit,current.y)),
    }))
  }
  const selectedZone=ZONES.find(z=>z.id===selected)
  const choose=(id:string)=>{if(!drag.current.moved)onSelect?.(id)}
  const reset=()=>{setZoom(1);setPan({x:0,y:0})}
  return (
    <div className="overflow-hidden rounded-2xl border border-[#263c59] bg-[#0c1b32] text-white shadow-xl shadow-navy/10">
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-white/10 ${compact?'px-4 py-3':'px-5 py-4 sm:px-6'}`}>
        <div>
          <div className="text-[10px] font-bold tracking-[.22em] text-[#c9a567]">MOC EXPO 2026 · VENUE GUIDE</div>
          <div className="mt-1 text-sm font-semibold tracking-wide sm:text-base">QSNCC <span className="mx-2 text-white/25">/</span> HALL 7–8</div>
        </div>
        {!compact && <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1">
          <button type="button" onClick={()=>changeZoom(Math.max(1,zoom-.25))} disabled={zoom===1} aria-label={tr('ซูมออก','Zoom out')} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-30"><Minus size={15}/></button>
          <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom*100)}%</span>
          <button type="button" onClick={()=>changeZoom(Math.min(2.5,zoom+.25))} disabled={zoom===2.5} aria-label={tr('ซูมเข้า','Zoom in')} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-30"><Plus size={15}/></button>
          <span className="mx-1 h-4 w-px bg-white/15"/>
          <button type="button" onClick={reset} aria-label={tr('แสดงผังทั้งหมด','Reset map view')} className="rounded-lg p-2 hover:bg-white/10"><RotateCcw size={14}/></button>
        </div>}
      </div>
      <svg viewBox="90 15 1290 790" className={`block h-auto w-full select-none ${zoom>1?'cursor-grab active:cursor-grabbing':''}`} style={{touchAction:zoom>1?'none':'pan-y'}} role="group" aria-labelledby={`${uid}-title ${uid}-desc`}
        onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y,active:zoom>1,moved:false}}}
        onPointerMove={e=>{const s=drag.current;if(!s.active)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;if(Math.abs(dx)+Math.abs(dy)<5)return;s.moved=true;e.currentTarget.setPointerCapture(e.pointerId);const ratio=1290/e.currentTarget.getBoundingClientRect().width;const limit=(zoom-1)*650;setPan({x:Math.max(-limit,Math.min(limit,s.px+dx*ratio)),y:Math.max(-limit,Math.min(limit,s.py+dy*ratio))})}}
        onPointerUp={e=>{drag.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
        onPointerCancel={()=>{drag.current.active=false}}>
        <title id={`${uid}-title`}>{tr('ผังพื้นที่จัดงาน MOC Expo แบบ 2.5D','MOC Expo 2.5D event floor plan')}</title>
        <desc id={`${uid}-desc`}>{tr('ผังแนวคิด Hall 7–8 เลือกโซนเพื่อดูรายละเอียด มีบูธ เวที โต๊ะกิจกรรม จุดลงทะเบียน และทางเดิน','Concept layout for Halls 7–8. Select a zone to explore booths, stage, activity tables, registration and aisles.')}</desc>
        <defs>
          <radialGradient id={`${uid}-bg`}><stop stopColor="#203c5b"/><stop offset="1" stopColor="#0c1b32"/></radialGradient>
          <pattern id={`${uid}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" opacity=".055"/></pattern>
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="13"/></filter>
        </defs>
        <rect x="90" y="15" width="1290" height="790" fill={`url(#${uid}-bg)`}/>
        <rect x="90" y="15" width="1290" height="790" fill={`url(#${uid}-dots)`}/>
        <g transform={`translate(${pan.x} ${pan.y}) translate(730 410) scale(${zoom}) translate(-730 -410)`}>
          <g pointerEvents="none">
            <polygon points={footprint(-22,-20,1045,642,-40)} fill="#010817" opacity=".7" filter={`url(#${uid}-shadow)`}/>
            <Box x={-22} y={-20} w={1045} d={642} h={22} z={-22} top="#ecebe5" front="#a9b9c6" side="#829aaa" />
            <polygon points={footprint(-16,-14,1033,630,-8)} fill="none" stroke="#edf2f4" strokeWidth="2"/>
            <Box x={-22} y={-20} w={1045} d={9} h={53} top="#fff" front="#e3e8e7" side="#acbeca" />
            <Box x={-22} y={-11} w={9} d={618} h={53} top="#fff" front="#bdcbd0" side="#d7e0df" />
            {[0,1,2,3,4,5,6,7,8,9].map(i=><Box key={i} x={34+i*102} y={-15} w={5} d={6} h={60} top="#f6f8f9" front="#b7c8cf" side="#9bafb9"/>)}
            {[0,1,2,3,4,5].map(i=><Box key={i} x={-16} y={35+i*100} w={6} d={5} h={60} top="#f6f8f9" front="#b7c8cf" side="#9bafb9"/>)}
            <g transform={plane()}>
              <path d="M 0 276 H 1000 M 497 0 V 510 M 0 507 H 1000" stroke="#fff" strokeWidth="10"/>
              <path d="M 0 276 H 1000 M 497 0 V 510 M 0 507 H 1000" stroke="#c7d0d3" strokeWidth="1" strokeDasharray="6 8"/>
              <text x="365" y="282" fill="#799096" fontSize="10" fontWeight="700" letterSpacing="3">CENTRAL WALKWAY</text>
              <path d="M350 609 V557 M337 571 L350 557 L363 571" stroke="#b28a42" fill="none" strokeWidth="4"/>
            </g>
          </g>
          {ZONES.map((z,i)=>{
            const active=selected===z.id
            return <g key={z.id} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined} aria-label={L(z.label)} aria-pressed={onSelect?active:undefined}
              onClick={()=>choose(z.id)} onKeyDown={onSelect?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(z.id)}}:undefined}
              className={onSelect?'floor-zone cursor-pointer focus:outline-none':''}>
              <title>{L(z.label)} — {L(z.desc)}</title>
              <polygon points={footprint(z.x+5,z.y+5,z.w-10,z.h-10)} fill={z.color} fillOpacity={active?.25:.12} stroke={active?'#efc36e':z.color} strokeOpacity={active?1:.25} strokeWidth={active?4:1} className="transition-colors"/>
              <polygon className="zone-focus" points={footprint(z.x+1,z.y+1,z.w-2,z.h-2)} fill="transparent" stroke="#fff" strokeWidth="3" opacity="0"/>
              <g transform={plane(1)} pointerEvents="none"><text x={z.x+15} y={z.y+z.h-15} fill={z.color} opacity=".6" fontSize="17" fontWeight="800">{String(i+1).padStart(2,'0')}</text></g>
            </g>
          })}
          <g pointerEvents="none">
            {ORDERED_ZONES.map(zone=><Furnishings key={zone.id} zone={zone}/>)}
            {[{x:13,y:278},{x:259,y:305},{x:493,y:20},{x:744,y:266},{x:744,y:479},{x:983,y:500},{x:11,y:507}].map((p,i)=><Plant key={i} {...p}/>)}
            {[{x:120,y:275},{x:285,y:272},{x:501,y:171},{x:695,y:277},{x:855,y:277},{x:751,y:365},{x:376,y:508},{x:622,y:508}].map((p,i)=>{const [px,py]=project(p.x,p.y);return <g key={i}><ellipse cx={px+2} cy={py+1} rx="5" ry="2.5" fill="#253c5620"/><path d={`M${px-1} ${py-4}v4m4-4v4`} stroke="#637386" strokeWidth="1.7"/><rect x={px-3} y={py-12} width="7" height="9" rx="3" fill={i%2?'#9fa8af':'#c5a778'}/><circle cx={px+.5} cy={py-15} r="3" fill="#d6b798"/></g>})}
            <Box x={-20} y={606} w={312} d={6} h={14} top="#f3f5f3" front="#c1cfd5"/>
            <Box x={410} y={606} w={611} d={6} h={14} top="#f3f5f3" front="#c1cfd5"/>
            <Box x={1017} y={-10} w={6} d={615} h={14} top="#f3f5f3" front="#c1cfd5"/>
            <g transform={plane(2)}><text x="298" y="600" fontSize="13" fontWeight="800" fill="#8c6d33" letterSpacing="2">ENTRANCE</text></g>
          </g>
          <g pointerEvents="none">
            {ZONES.map((z,i)=>{
              const active=z.id===selected
              const [px,py]=project(z.x+z.w/2,z.y+(z.h<100?4:28),z.h<100?12:16)
              const label=LABELS[z.id][0]
              const width=Math.max(123,label.length*7.1+43)
              return <g key={z.id} transform={`translate(${px} ${py})`}>
                <rect x={-width/2+2} y={-23+3} width={width} height="37" rx="6" fill="#10253e" opacity=".12"/>
                <rect x={-width/2} y="-23" width={width} height="37" rx="6" fill={active?z.color:'#fff'} stroke={active?'#edc378':'#d3dde5'} strokeWidth={active?2:1}/>
                <rect x={-width/2+5} y="-18" width="26" height="26" rx="4" fill={active?'#ffffff20':z.color}/>
                <text x={-width/2+18} y="0" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{String(i+1).padStart(2,'0')}</text>
                <text x={-width/2+38} y="-1" fill={active?'#fff':'#22394d'} fontSize="11.5" fontWeight="800" letterSpacing=".3">{label}</text>
                {active && <><path d="M-5 15L0 21L5 15" fill="#edc378"/><circle cx="0" cy="25" r="3" fill="#edc378"/></>}
              </g>
            })}
            <g transform="translate(442 82)"><path d="M0 0L-27 16" stroke="#c9a567" strokeWidth="2"/><text x="-35" y="26" textAnchor="end" fontSize="21" fontWeight="800" fill="#fff">HALL 7</text><text x="-35" y="44" textAnchor="end" fontSize="9" letterSpacing="2" fill="#9cb1c7">EXHIBITION & PARTNERS</text></g>
            <g transform="translate(1090 231)"><path d="M0 0L44 -34" stroke="#c9a567" strokeWidth="2"/><text x="52" y="-38" fontSize="21" fontWeight="800" fill="#fff">HALL 8</text><text x="52" y="-20" fontSize="9" letterSpacing="2" fill="#9cb1c7">EXPERIENCE & ACTIVITY</text></g>

          </g>
        </g>
      </svg>
      {!compact && <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[.025] px-5 py-3 text-[11px] sm:px-6">
        <span className="flex items-center gap-2 text-[#b2c3d6]"><Move size={13}/>{tr('ซูมแล้วลากเพื่อสำรวจพื้นที่','Zoom in and drag to explore')}</span>
        <span className="flex items-center gap-2 text-[#e5c38c]"><span className="size-1.5 rounded-full bg-[#e5c38c]"/>{selectedZone?L(selectedZone.label):tr('เลือกโซนบนผัง','Select a zone')}</span>
      </div>}
      <style>{`.floor-zone:hover .zone-focus,.floor-zone:focus-visible .zone-focus{opacity:1}`}</style>
    </div>
  )
}
