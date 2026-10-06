import { useMemo } from 'react'
import { useDemoStore } from './demoStore'
import { SEED_ATTENDEES, SEED_MEETINGS } from '../data/seed'
import { BASELINE } from '../data/event'
import { EXHIBITORS } from '../data/exhibitors'
import type { Attendee, AttendeeType, Exhibitor, Meeting } from '../data/types'

const SEED_CHECKED = new Set(SEED_ATTENDEES.filter((a) => a.checkedInAt).map((a) => a.id))

/** รายชื่อผู้ลงทะเบียนทั้งหมด (ใหม่ + ตัวอย่าง) พร้อมสถานะเช็คอินล่าสุด */
export function useAttendees(): Attendee[] {
  const registrations = useDemoStore((s) => s.registrations)
  const checkins = useDemoStore((s) => s.checkins)
  return useMemo(
    () =>
      [...registrations, ...SEED_ATTENDEES].map((a) =>
        checkins[a.id] && !a.checkedInAt ? { ...a, checkedInAt: checkins[a.id] } : a,
      ),
    [registrations, checkins],
  )
}

export function useAttendee(id: string | undefined) {
  const all = useAttendees()
  return useMemo(() => all.find((a) => a.id.toUpperCase() === id?.toUpperCase()), [all, id])
}

export function useExhibitors(): Exhibitor[] {
  const overrides = useDemoStore((s) => s.exhibitorStatus)
  return useMemo(() => EXHIBITORS.map((e) => (overrides[e.id] ? { ...e, status: overrides[e.id] } : e)), [overrides])
}

/** การนัดหมายทั้งหมด (ตัวอย่างในระบบ + ที่สร้างระหว่าง Demo) */
export function useAllMeetings(): Meeting[] {
  const mine = useDemoStore((s) => s.myMeetings)
  return useMemo(() => [...mine, ...SEED_MEETINGS], [mine])
}

/** ตัวเลข KPI หลัก = ค่าฐานของงาน + สิ่งที่เกิดขึ้นสดระหว่าง Demo */
export function useKpis() {
  const registrations = useDemoStore((s) => s.registrations)
  const checkins = useDemoStore((s) => s.checkins)
  const myMeetings = useDemoStore((s) => s.myMeetings)
  const surveys = useDemoStore((s) => s.surveys)

  return useMemo(() => {
    const regById = new Map(registrations.map((r) => [r.id, r]))
    const seedById = new Map(SEED_ATTENDEES.map((a) => [a.id, a]))
    const newCheckinIds = Object.keys(checkins).filter((id) => !SEED_CHECKED.has(id))

    const byType = { ...BASELINE.byType }
    registrations.forEach((r) => (byType[r.type] += 1))
    const checkedInByType = { ...BASELINE.checkedInByType }
    newCheckinIds.forEach((id) => {
      const t: AttendeeType | undefined = regById.get(id)?.type ?? seedById.get(id)?.type
      if (t) checkedInByType[t] += 1
    })

    const completed = myMeetings.filter((m) => m.status === 'completed' && m.result)
    const dealAdd = completed.reduce((s, m) => s + (m.result?.dealValue ?? 0), 0)
    const forecastAdd = completed.reduce((s, m) => s + (m.result?.forecast ?? 0), 0)
    const deals = completed.filter((m) => m.result?.outcome === 'deal').length

    const surveyAvg = surveys.length
      ? surveys.reduce((s, r) => {
          const vals = Object.values(r.scores)
          return s + vals.reduce((a, b) => a + b, 0) / Math.max(vals.length, 1)
        }, 0) / surveys.length
      : 0
    const responses = BASELINE.surveyResponses + surveys.length
    const satisfaction = (BASELINE.satisfaction * BASELINE.surveyResponses + surveyAvg * surveys.length) / responses

    const registered = BASELINE.registered + registrations.length
    const checkedIn = BASELINE.checkedIn + newCheckinIds.length

    return {
      registered,
      checkedIn,
      attendance: checkedIn / registered,
      byType,
      checkedInByType,
      exhibitors: BASELINE.exhibitors,
      matchingCompleted: BASELINE.matchingCompleted + completed.length,
      matchingScheduled: BASELINE.matchingCompleted + 96 + myMeetings.filter((m) => m.status !== 'completed').length,
      deals: 163 + deals,
      dealValue: BASELINE.dealValue + dealAdd,
      forecastValue: BASELINE.forecastValue + forecastAdd,
      salesOnsite: BASELINE.salesOnsite,
      satisfaction,
      surveyResponses: responses,
      nps: BASELINE.nps,
      liveRegistrations: registrations.length,
      liveCheckins: newCheckinIds.length,
      liveDeal: dealAdd,
    }
  }, [registrations, checkins, myMeetings, surveys])
}
