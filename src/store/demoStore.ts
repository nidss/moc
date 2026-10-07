import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_ATTENDEES, SEED_MY_MEETINGS, makeAttendeeId } from '../data/seed'
import { EXHIBITORS } from '../data/exhibitors'
import { BASELINE } from '../data/event'
import type { Attendee, BoothLead, Meeting, SurveyResponse } from '../data/types'

export type RegistrationInput = Omit<Attendee, 'id' | 'registeredAt' | 'checkedInAt' | 'type'> & { type?: Attendee['type'] }

type DemoState = {
  boothLeads: BoothLead[]
  saveBoothLead: (input: Omit<BoothLead, 'createdAt' | 'updatedAt'>) => boolean
  /** ผู้ลงทะเบียนใหม่ที่เกิดขึ้นระหว่าง Demo */
  registrations: Attendee[]
  /** เวลาที่เช็คอิน (รวมทั้งผู้ลงทะเบียนตัวอย่างและผู้ลงทะเบียนใหม่) */
  checkins: Record<string, string>
  /** การนัดหมาย Business Matching ของ SME ตัวละครหลัก */
  myMeetings: Meeting[]
  surveys: SurveyResponse[]
  exhibitorStatus: Record<string, 'approved' | 'pending'>
  lastRegisteredId?: string

  register: (input: RegistrationInput) => Attendee
  checkIn: (id: string) => void
  requestMeeting: (m: Omit<Meeting, 'id' | 'status' | 'table'>) => Meeting
  updateMeeting: (id: string, patch: Partial<Meeting>) => void
  saveResult: (id: string, result: NonNullable<Meeting['result']>) => void
  submitSurvey: (s: Omit<SurveyResponse, 'id' | 'at'>) => void
  setExhibitorStatus: (id: string, status: 'approved' | 'pending') => void
  reset: () => void
}

const initial = () => ({
  boothLeads: [] as BoothLead[],
  registrations: [] as Attendee[],
  checkins: {} as Record<string, string>,
  myMeetings: SEED_MY_MEETINGS.map((m) => ({ ...m })),
  surveys: [] as SurveyResponse[],
  exhibitorStatus: {} as Record<string, 'approved' | 'pending'>,
  lastRegisteredId: undefined as string | undefined,
})

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initial(),

      saveBoothLead: (input) => {
        const s = get()
        if (!EXHIBITORS.some((e) => e.id === input.exhibitorId && (s.exhibitorStatus[e.id] ?? e.status) === 'approved') ||
            ![...s.registrations, ...SEED_ATTENDEES].some((a) => a.id === input.attendeeId)) return false
        const existing = s.boothLeads.find((l) => l.exhibitorId === input.exhibitorId && l.attendeeId === input.attendeeId)
        const now = new Date().toISOString()
        const lead: BoothLead = { ...input, createdAt: existing?.createdAt ?? now, updatedAt: now }
        set({ boothLeads: existing ? s.boothLeads.map((l) => l === existing ? lead : l) : [...s.boothLeads, lead] })
        return true
      },

      register: (input) => {
        const type = input.type ?? 'visitor'
        const attendee: Attendee = {
          ...input,
          type,
          id: makeAttendeeId(type, BASELINE.registered + get().registrations.length + 1),
          registeredAt: new Date().toISOString(),
        }
        set((s) => ({ registrations: [attendee, ...s.registrations], lastRegisteredId: attendee.id }))
        return attendee
      },

      checkIn: (id) =>
        set((s) => (s.checkins[id] ? s : { checkins: { ...s.checkins, [id]: new Date().toISOString() } })),

      requestMeeting: (m) => {
        const n = get().myMeetings.length
        const meeting: Meeting = {
          ...m,
          id: `M${3000 + n}`,
          status: 'confirmed',
          table: `${'ABCD'[n % 4]}${String(10 + n).padStart(2, '0')}`,
        }
        set((s) => ({ myMeetings: [...s.myMeetings, meeting] }))
        return meeting
      },

      updateMeeting: (id, patch) =>
        set((s) => ({ myMeetings: s.myMeetings.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),

      saveResult: (id, result) =>
        set((s) => ({
          myMeetings: s.myMeetings.map((m) => (m.id === id ? { ...m, status: 'completed', result } : m)),
        })),

      submitSurvey: (r) =>
        set((s) => ({
          surveys: [...s.surveys, { ...r, id: `R${s.surveys.length + 1}`, at: new Date().toISOString() }],
        })),

      setExhibitorStatus: (id, status) =>
        set((s) => ({ exhibitorStatus: { ...s.exhibitorStatus, [id]: status } })),

      reset: () => set(initial()),
    }),
    { name: 'moc-expo-demo', version: 1 },
  ),
)
