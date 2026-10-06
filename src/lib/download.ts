import writeExcelFile from 'write-excel-file/browser'
import { EVENT } from '../data/event'

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export type ExcelCell = string | number | null

/** สร้างไฟล์ .xlsx จากหัวตารางและแถวข้อมูล แล้วให้ผู้ใช้ดาวน์โหลด */
export async function exportExcel(filename: string, headers: string[], rows: ExcelCell[][], sheet = 'Report') {
  const data = [
    headers.map((h) => ({ value: h, fontWeight: 'bold' as const, backgroundColor: '#E7EEFB' })),
    ...rows.map((r) => r.map((v) => (v === null || v === '' ? null : { value: v }))),
  ]
  const columns = headers.map((h, i) => ({
    width: Math.min(40, Math.max(h.length, ...rows.slice(0, 50).map((r) => String(r[i] ?? '').length)) + 2),
  }))
  await writeExcelFile(data, { columns, sheet, stickyRowsCount: 1 }).toFile(filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

/** ไฟล์ปฏิทิน .ics สำหรับปุ่ม Add to Calendar */
export function downloadIcs(title: string, location: string, description: string) {
  const start = EVENT.days[0].replace(/-/g, '')
  const endDate = new Date(EVENT.days[EVENT.days.length - 1])
  endDate.setDate(endDate.getDate() + 1)
  const end = endDate.toISOString().slice(0, 10).replace(/-/g, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MOC Expo 2026//Demo//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@moc-expo-demo`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  downloadBlob(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), 'moc-expo-2026.ics')
}
