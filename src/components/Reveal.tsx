import { useEffect, useRef, useState, type HTMLAttributes } from 'react'

/** คืนค่า true ครั้งเดียวเมื่อ element เลื่อนเข้ามาในจอ (ไม่มี IntersectionObserver = แสดงทันที) */
function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect() }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [inView])
  return [ref, inView] as const
}

/**
 * ห่อเนื้อหาให้ค่อย ๆ ลอยขึ้นเมื่อเลื่อนมาถึง
 * - group: ลูกแต่ละตัวโผล่ทีละใบ (ใช้กับ grid ของการ์ด)
 * - ปิดอัตโนมัติเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว (ดู index.css)
 */
export function Reveal({ group = false, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { group?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  return <div ref={ref} className={`${group ? 'reveal-group' : 'reveal'} ${inView ? 'is-in' : ''} ${className}`} {...rest} />
}
