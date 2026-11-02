import { useSyncExternalStore } from 'react'

/**
 * เวอร์ชันโครงหน้าเว็บสาธารณะ
 * - v1: หน้าแรกแบบเต็ม (แสดงทุก section)
 * - v2: หน้าแรกแบบกระชับสำหรับผู้เข้าชมครั้งแรก เนื้อหารองย้ายไปอยู่ในเมนูย่อยด้านบน
 * ใช้ร่วมกับธีม (skin) ได้ทุกแบบ เพราะใช้สีจาก token
 */
export type SiteVersion = 'v1' | 'v2'

const KEY = 'moc-demo-version'
const listeners = new Set<() => void>()

function read(): SiteVersion {
  try { return localStorage.getItem(KEY) === 'v2' ? 'v2' : 'v1' } catch { return 'v1' }
}

let current: SiteVersion = read()

export function setVersion(v: SiteVersion) {
  current = v
  try { localStorage.setItem(KEY, v) } catch { /* ใช้ได้เฉพาะหน้านี้ */ }
  listeners.forEach((l) => l())
}

export function useVersion(): SiteVersion {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb) }, () => current, () => current)
}
