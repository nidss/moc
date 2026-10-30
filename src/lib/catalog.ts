import type { Buyer, Exhibitor, Product } from '../data/types'

/** สินค้าที่กรอกครบทั้ง 2 ภาษาและมีรูป จึงจะแสดงบน e-Catalog */
export function isProductComplete(p: Product) {
  return !!(p.image && p.name.th.trim() && p.name.en.trim() && p.unit.th.trim() && p.unit.en.trim() && p.price > 0)
}

export function catalogProducts(ex: Exhibitor) {
  return ex.products.filter((p) => !p.hidden && isProductComplete(p))
}

/** คะแนนความเหมาะสมแบบง่าย: หมวดตรงกัน + ความสนใจสินค้าส่งออก */
export function buyerScore(me: Exhibitor, b: Buyer) {
  const score = (b.interests.includes(me.category) ? 70 : 35) + (b.interests.length <= 3 ? 15 : 8) + (me.tags.includes('export-ready') && b.country.en !== 'Thailand' ? 12 : 0)
  return Math.min(98, score)
}
