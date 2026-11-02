import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'

const pad = (n: number) => String(n).padStart(2, '0')

/** แยกเวลาที่เหลือ (มิลลิวินาที) เป็น วัน / ชั่วโมง / นาที / วินาที */
function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86_400), h: Math.floor((s % 86_400) / 3_600), m: Math.floor((s % 3_600) / 60), s: s % 60 }
}

/** ค่าเวลาปัจจุบันที่อัปเดตทุกวินาที */
export function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/**
 * นับถอยหลังสู่วันงานแบบเรียลไทม์ (วัน ชั่วโมง นาที วินาที) สำหรับวางบนพื้นน้ำเงินเข้ม
 * เมื่อถึงเวลาเปิดงานจะแสดงสถานะ "กำลังจัดงาน" และหลังปิดงานแสดง "จบงานแล้ว"
 */
export function Countdown({ startsAt, endsAt }: { startsAt: string; endsAt: string }) {
  const { tr } = useI18n()
  const now = useNow()
  const start = new Date(startsAt).getTime()
  const end = new Date(endsAt).getTime()

  if (now >= start) {
    const live = now < end
    return (
      <div className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
        {live && <span className="size-3 shrink-0 animate-pulse rounded-full bg-emerald-400" />}
        <span className="gold-text-gradient">{live ? tr('งานกำลังจัดอยู่ตอนนี้', 'The event is on now') : tr('จบงานแล้ว ขอบคุณที่ร่วมงาน', 'The event has ended. Thank you!')}</span>
      </div>
    )
  }

  const { d, h, m, s } = split(start - now)
  const parts = [
    [String(d), tr('วัน', 'Days')],
    [pad(h), tr('ชั่วโมง', 'Hours')],
    [pad(m), tr('นาที', 'Minutes')],
    [pad(s), tr('วินาที', 'Seconds')],
  ]
  return (
    <div role="timer" aria-label={tr(`เหลืออีก ${d} วัน ${h} ชั่วโมง ${m} นาที`, `${d} days ${h} hours ${m} minutes to go`)}
      className="grid grid-cols-4 gap-2 sm:gap-3">
      {parts.map(([n, label]) => (
        <div key={label} className="min-w-0 rounded-xl bg-white/[0.08] px-2 py-3 text-center ring-1 ring-white/15 sm:min-w-24 sm:px-4">
          {/* key เปลี่ยนตามค่า ทำให้ตัวเลขที่เปลี่ยนเล่นแอนิเมชันหล่นเข้าทุกครั้ง */}
          <div className="overflow-hidden" aria-hidden="true">
            <div key={n} className="motion-tick gold-text-gradient text-3xl font-extrabold leading-none tabular-nums sm:text-5xl">{n}</div>
          </div>
          <div className="mt-1.5 text-xs text-white/75 sm:text-sm" aria-hidden="true">{label}</div>
        </div>
      ))}
    </div>
  )
}

/** เวลาที่เหลือก่อนเปิดงาน + สถานะ (ใช้กับตัวนับถอยหลังแบบอื่นในแต่ละธีม) */
export function useTimeLeft(startsAt: string, endsAt: string) {
  const now = useNow()
  const start = new Date(startsAt).getTime()
  const state: 'before' | 'live' | 'ended' = now < start ? 'before' : now < new Date(endsAt).getTime() ? 'live' : 'ended'
  return { ...split(start - now), state, pad }
}
