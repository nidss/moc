import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

/**
 * แถบพื้นหลังเต็มความกว้างสำหรับแบ่ง section บนหน้าแรก
 * - plain: พื้นหลังปกติ · white: พื้นขาวมีเส้นขอบบน/ล่าง · tint: ฟ้าอ่อน · warm: ทองอ่อน · navy: น้ำเงินเข้ม (ตัวอักษรขาว)
 */
export type BandTone = 'plain' | 'white' | 'tint' | 'warm' | 'navy'

const TONE: Record<BandTone, string> = {
  plain: 'bg-bg',
  white: 'bg-surface border-y border-line',
  tint: 'bg-[linear-gradient(180deg,var(--brand-soft),var(--bg))]',
  warm: 'bg-[linear-gradient(180deg,var(--accent-soft),var(--bg))]',
  navy: 'hero-bg text-white',
}

export function Band({ tone = 'plain', id, children }: { tone?: BandTone; id?: string; children: ReactNode }) {
  return (
    <section id={id} className={`relative scroll-mt-16 overflow-hidden py-14 sm:py-20 ${TONE[tone]}`}>
      {tone === 'navy' && <div className="hero-net pointer-events-none absolute inset-0 opacity-70" />}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

/** หัวข้อ section: ป้ายภาษาอังกฤษสีทอง + เส้นทอง, หัวข้อใหญ่, คำอธิบาย และลิงก์ด้านขวา */
export function BandTitle({ eyebrow, title, subtitle, action, dark = false }: {
  eyebrow?: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode; dark?: boolean
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className={`mb-2.5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-gold-light' : 'text-gold-text'}`}>
            <span className="gold-gradient h-0.5 w-8 rounded-full" /> {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className={`mt-1.5 text-sm sm:text-base ${dark ? 'text-white/70' : 'text-muted'}`}>{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  )
}

/** ลิงก์ "ดูทั้งหมด →" ที่ปรับสีตามพื้นหลัง */
export function BandLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return <Link to={to} className={`text-sm font-semibold hover:underline ${dark ? 'text-gold-light' : 'text-brand'}`}>{children} →</Link>
}
