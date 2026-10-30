import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_ATTENDEES, SEED_MY_MEETINGS, makeAttendeeId } from '../data/seed'
import { EXHIBITORS } from '../data/exhibitors'
import { BASELINE } from '../data/event'
import type { Attendee, BoothLead, Exhibitor, Meeting, Product, SurveyResponse } from '../data/types'

export type RegistrationInput = Omit<Attendee, 'id' | 'registeredAt' | 'checkedInAt' | 'type'> & { type?: Attendee['type'] }
export type ExhibitorInput = Pick<Exhibitor, 'name' | 'owner' | 'shopType' | 'category' | 'province' | 'agency' | 'logo' | 'contact' | 'social' | 'stores' | 'matching' | 'documents'>
export type ShopPatch = Partial<Omit<Exhibitor, 'id'>>

/** รวมผู้ประกอบการตัวอย่าง + ที่ลงทะเบียนระหว่างเดโม พร้อมข้อมูลที่ร้านแก้ไขเองและสถานะจากผู้จัดงาน */
export function mergeExhibitors(created: Exhibitor[], edits: Record<string, ShopPatch>, status: Record<string, 'approved' | 'pending'>): Exhibitor[] {
  return [...EXHIBITORS, ...created].map((e) => {
    const patch = edits[e.id]
    if (!patch && !status[e.id]) return e
    return { ...e, ...patch, ...(status[e.id] ? { status: status[e.id] } : {}) }
  })
}

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
  /** ผู้ประกอบการที่ลงทะเบียนระหว่าง Demo */
  newExhibitors: Exhibitor[]
  /** ข้อมูลร้านและสินค้าที่เจ้าของร้านแก้ไขผ่าน SME Portal */
  shopEdits: Record<string, ShopPatch>
  /** ร้านที่เข้าสู่ระบบ SME Portal อยู่ (เดโม ไม่มีระบบยืนยันตัวตนจริง) */
  portalId?: string

  register: (input: RegistrationInput) => Attendee
  checkIn: (id: string) => void
  requestMeeting: (m: Omit<Meeting, 'id' | 'status' | 'table'>) => Meeting
  updateMeeting: (id: string, patch: Partial<Meeting>) => void
  saveResult: (id: string, result: NonNullable<Meeting['result']>) => void
  submitSurvey: (s: Omit<SurveyResponse, 'id' | 'at'>) => void
  setExhibitorStatus: (id: string, status: 'approved' | 'pending') => void
  registerExhibitor: (input: ExhibitorInput) => Exhibitor
  updateShop: (id: string, patch: ShopPatch) => void
  saveProduct: (exhibitorId: string, product: Product) => void
  removeProduct: (exhibitorId: string, productId: string) => void
  portalLogin: (id: string) => void
  portalLogout: () => void
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
  newExhibitors: [] as Exhibitor[],
  shopEdits: {} as Record<string, ShopPatch>,
  portalId: undefined as string | undefined,
})

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initial(),

      saveBoothLead: (input) => {
        const s = get()
        if (!mergeExhibitors(s.newExhibitors, s.shopEdits, s.exhibitorStatus).some((e) => e.id === input.exhibitorId && e.status === 'approved') ||
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

      registerExhibitor: (input) => {
        const s = get()
        const n = EXHIBITORS.length + s.newExhibitors.length + 1
        // ร้านดัง/ร้านเชฟ/ร้านรางวัลหมวดอาหารไปโซน MOC TASTE ที่เหลืออยู่ MOC HUB
        const taste = input.category === 'food' && input.shopType !== 'general'
        const ex: Exhibitor = {
          ...input,
          id: `sme-${n}-${Date.now().toString(36)}`,
          brand: input.name.en,
          banner: '',
          smeOneId: '',
          pavilion: taste ? 'taste' : 'hub',
          productType: 'consumer',
          description: { th: '', en: '' },
          booth: `${taste ? 'T' : 'H'}-${40 + s.newExhibitors.length + 1}`,
          tags: [],
          products: [],
          status: 'pending',
          color: '#0a3480',
          registeredAt: new Date().toISOString(),
        }
        set({ newExhibitors: [...s.newExhibitors, ex] })
        return ex
      },

      updateShop: (id, patch) =>
        set((s) => s.newExhibitors.some((e) => e.id === id)
          ? { newExhibitors: s.newExhibitors.map((e) => (e.id === id ? { ...e, ...patch } : e)) }
          : { shopEdits: { ...s.shopEdits, [id]: { ...s.shopEdits[id], ...patch } } }),

      saveProduct: (exhibitorId, product) => {
        const s = get()
        const ex = mergeExhibitors(s.newExhibitors, s.shopEdits, s.exhibitorStatus).find((e) => e.id === exhibitorId)
        if (!ex) return
        const exists = ex.products.some((p) => p.id === product.id)
        get().updateShop(exhibitorId, { products: exists ? ex.products.map((p) => (p.id === product.id ? product : p)) : [...ex.products, product] })
      },

      removeProduct: (exhibitorId, productId) => {
        const s = get()
        const ex = mergeExhibitors(s.newExhibitors, s.shopEdits, s.exhibitorStatus).find((e) => e.id === exhibitorId)
        if (ex) get().updateShop(exhibitorId, { products: ex.products.filter((p) => p.id !== productId) })
      },

      portalLogin: (id) => set({ portalId: id }),
      portalLogout: () => set({ portalId: undefined }),

      reset: () => set(initial()),
    }),
    { name: 'moc-expo-demo', version: 1 },
  ),
)
