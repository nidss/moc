import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import promo from '../assets/brand/promo-lucky-draw.webp'

const SEEN_KEY = 'moc-demo-promo-seen'

function seen() {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
function markSeen() {
  try { localStorage.setItem(SEEN_KEY, '1') } catch { /* เบราว์เซอร์ปิด storage: popup จะแสดงอีกครั้งตอนโหลดหน้าใหม่ */ }
}
/** ให้ popup แสดงอีกครั้ง (ใช้ตอนรีเซ็ตข้อมูลเดโม) */
export function resetPromoSeen() {
  try { localStorage.removeItem(SEEN_KEY) } catch { /* ไม่ต้องทำอะไร */ }
}

/**
 * Popup โปรโมต "ลงทะเบียนเข้างาน รับสิทธิ์ลุ้นรางวัลใหญ่" แสดงครั้งแรกที่เข้าเว็บ
 * กดที่ภาพ (ปุ่มลงทะเบียนรับสิทธิ์) ไปหน้าลงทะเบียน · ปิดได้ด้วยปุ่ม X, คลิกพื้นหลัง หรือ Esc
 */
export function PromoPopup() {
  const { tr } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (seen() || pathname.startsWith('/register')) return
    const id = window.setTimeout(() => setOpen(true), 700)
    return () => window.clearTimeout(id)
    // แสดงเฉพาะตอนเข้าเว็บครั้งแรก ไม่ต้องตามการเปลี่ยนหน้า
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => { markSeen(); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div role="dialog" aria-modal="true" aria-label={tr('ลงทะเบียนเข้างาน รับสิทธิ์ลุ้นรางวัลใหญ่', 'Register to win big prizes')}
        className="motion-pop relative w-[min(92vw,82vh,560px)]" onClick={(e) => e.stopPropagation()}>
        <Link to="/register" onClick={close} className="block overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 focus-visible:outline-4 focus-visible:outline-gold">
          <img src={promo} width={1000} height={1000} alt={tr(
            'ลงทะเบียนเข้างาน รับสิทธิ์ลุ้นรางวัลใหญ่ iPad, Samsung Fold 8, iPhone และ Voucher — กดเพื่อลงทะเบียนรับสิทธิ์',
            'Register for the event to win iPad, Samsung Fold 8, iPhone and vouchers — tap to register')}
            className="block h-auto w-full select-none" draggable={false} />
        </Link>
        <button onClick={close} aria-label={tr('ปิด', 'Close')} autoFocus
          className="absolute -top-3 -right-3 flex size-10 items-center justify-center rounded-full bg-white text-navy shadow-lg ring-1 ring-black/10 transition hover:scale-105">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
