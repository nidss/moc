import { useSyncExternalStore } from 'react'
import type { LText } from '../i18n/I18nProvider'

/** ธีมหน้าตาของระบบ (สลับได้ทุกหน้า ฟังก์ชันเหมือนเดิม) */
export type Skin = 'classic' | 'jade' | 'midnight'

export const SKINS: { id: Skin; name: LText; desc: LText; swatch: [string, string, string]; dark?: boolean }[] = [
  { id: 'classic', name: { th: 'คลาสสิก', en: 'Classic' }, desc: { th: 'น้ำเงินกรมท่า + ทอง', en: 'Navy & gold' }, swatch: ['#002a6e', '#c8902a', '#f3f6fb'] },
  { id: 'jade', name: { th: 'หยกมรกต', en: 'Jade' }, desc: { th: 'เขียวหยก + อำพัน โค้งมน', en: 'Teal & amber, rounded' }, swatch: ['#0f766e', '#f59e0b', '#f1f8f6'] },
  { id: 'midnight', name: { th: 'มิดไนท์', en: 'Midnight' }, desc: { th: 'โหมดมืด ม่วง + ฟ้านีออน', en: 'Dark violet & neon cyan' }, swatch: ['#8b5cf6', '#22d3ee', '#0b0b18'], dark: true },
]

const KEY = 'moc-demo-skin'
const listeners = new Set<() => void>()

function read(): Skin {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'jade' || v === 'midnight') return v
  } catch { /* storage ถูกปิด: ใช้ธีมเริ่มต้น */ }
  return 'classic'
}

let current: Skin = read()

/** ใส่ data-skin ให้ <html> (เรียกก่อน render เพื่อไม่ให้หน้ากะพริบ) */
export function applySkin(s: Skin = current) {
  if (s === 'classic') delete document.documentElement.dataset.skin
  else document.documentElement.dataset.skin = s
}

export function setSkin(s: Skin) {
  current = s
  try { localStorage.setItem(KEY, s) } catch { /* ใช้ได้เฉพาะหน้านี้ */ }
  applySkin(s)
  listeners.forEach((l) => l())
}

export function useSkin(): Skin {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb) }, () => current, () => current)
}

/** ธีมนี้เป็นพื้นเข้มเสมอหรือไม่ (ใช้เลือกโลโก้ขาว) */
export const isDarkSkin = (s: Skin) => SKINS.find((k) => k.id === s)?.dark === true
