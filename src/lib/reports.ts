import { ATTENDEE_TYPES, CATEGORIES, PAVILIONS, PROVINCES, OCCUPATIONS } from '../data/event'
import { BUYER_BY_ID, OBJECTIVES } from '../data/buyers'
import { EXHIBITOR_BY_ID } from '../data/exhibitors'
import { SALES_BY_CATEGORY, SATISFACTION_BY_TOPIC } from '../data/analytics'
import type { Attendee, Exhibitor, Meeting, SurveyResponse } from '../data/types'
import type { Lang } from '../i18n/I18nProvider'
import { exportExcel } from './download'

const dt = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '')

export function exportAttendees(rows: Attendee[], lang: Lang, filename = 'attendee-report') {
  return exportExcel(
    filename,
    ['Registration ID', 'Name', 'Type', 'Phone', 'Email', 'Age', 'Occupation', 'Province', 'Registered', 'Checked-in'],
    rows.map((a) => [
      a.id, a.name, ATTENDEE_TYPES[a.type][lang], a.phone, a.email, a.age ?? null,
      a.occupation ? OCCUPATIONS[a.occupation]?.[lang] ?? a.occupation : '',
      PROVINCES[a.province]?.[lang] ?? '', dt(a.registeredAt), dt(a.checkedInAt),
    ]),
    'Attendees',
  )
}

export function exportCheckins(rows: Attendee[], lang: Lang) {
  const checked = rows.filter((a) => a.checkedInAt).sort((a, b) => a.checkedInAt!.localeCompare(b.checkedInAt!))
  return exportExcel('checkin-report', ['Registration ID', 'Name', 'Type', 'Checked-in at'],
    checked.map((a) => [a.id, a.name, ATTENDEE_TYPES[a.type][lang], dt(a.checkedInAt)]), 'Check-in')
}

export function exportExhibitors(rows: Exhibitor[], lang: Lang) {
  return exportExcel('exhibitor-report',
    ['SME ONE ID', 'Company', 'Category', 'Pavilion', 'Booth', 'Province', 'Products', 'Contact', 'Phone', 'Email', 'Status'],
    rows.map((e) => [e.smeOneId, e.name[lang], CATEGORIES[e.category][lang], PAVILIONS[e.pavilion].name, e.booth, PROVINCES[e.province][lang], e.products.length, e.contact.name, e.contact.phone, e.contact.email, e.status]),
    'Exhibitors')
}

export function exportMeetings(rows: Meeting[], lang: Lang) {
  return exportExcel('business-matching-report',
    ['Meeting ID', 'SME', 'Buyer', 'Day', 'Time', 'Table', 'Objective', 'Status', 'Outcome', 'Deal Value (THB)', 'Forecast 1Y (THB)', 'Note'],
    rows.map((m) => [m.id, EXHIBITOR_BY_ID[m.exhibitorId]?.name[lang] ?? m.exhibitorId, BUYER_BY_ID[m.buyerId]?.name ?? m.buyerId, m.day, m.time, m.table,
      OBJECTIVES[m.objective][lang], m.status, m.result?.outcome ?? '', m.result?.dealValue ?? null, m.result?.forecast ?? null, m.result?.note ?? '']),
    'Matching')
}

export function exportSales(lang: Lang) {
  const total = SALES_BY_CATEGORY.reduce((s, r) => s + r.value, 0)
  return exportExcel('sales-report', ['Category', 'Onsite Sales (THB)', 'Share %'],
    [...SALES_BY_CATEGORY.map((r) => [CATEGORIES[r.category][lang], r.value, Math.round((r.value / total) * 1000) / 10]), ['Total', total, 100]], 'Sales')
}

export function exportSatisfaction(responses: SurveyResponse[]) {
  return exportExcel('satisfaction-report', ['Topic / Response', 'Score (1-5)', 'NPS (0-10)', 'Comment', 'Submitted'],
    [
      ...SATISFACTION_BY_TOPIC.map((r) => [`Average · ${r.topic}`, r.score, null, '', '']),
      ...responses.map((r) => [r.id, Math.round((Object.values(r.scores).reduce((a, b) => a + b, 0) / Object.values(r.scores).length) * 100) / 100, r.nps, r.comment, dt(r.at)]),
    ], 'Satisfaction')
}
