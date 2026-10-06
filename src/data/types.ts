import type { LText } from '../i18n/I18nProvider'

export type CategoryId = 'food' | 'health' | 'fashion' | 'home' | 'agri' | 'craft' | 'tech' | 'service'
export type PavilionId = 'hub' | 'taste' | 'private'
export type ProductType = 'consumer' | 'processed' | 'raw' | 'service'
export type AttendeeType = 'visitor' | 'sme' | 'buyer' | 'speaker' | 'media'

export type Product = {
  id: string
  name: LText
  price: number
  unit: LText
  channels: string[]
}

export type Exhibitor = {
  id: string
  name: LText
  brand: string
  smeOneId: string
  category: CategoryId
  pavilion: PavilionId
  province: string
  productType: ProductType
  description: LText
  booth: string
  /** หน่วยงานกระทรวงพาณิชย์ที่พาผู้ประกอบการมาออกบูธ (เฉพาะ MOC HUB) */
  agency?: string
  tags: string[]
  contact: { name: string; phone: string; email: string; line: string }
  social: { facebook?: string; instagram?: string; tiktok?: string }
  stores: { shopee?: string; lazada?: string; website?: string }
  products: Product[]
  status: 'approved' | 'pending'
  color: string
}

export type Buyer = {
  id: string
  name: string
  type: LText
  country: LText
  description: LText
  interests: CategoryId[]
  lookingFor: LText
  budget: string
  color: string
  slotsTaken: string[]
}

export type ScheduleItem = {
  id: string
  day: 1 | 2 | 3
  start: string
  end: string
  title: LText
  stage: 'main' | 'workshop' | 'matching' | 'taste'
  kind: 'ceremony' | 'talk' | 'workshop' | 'matching' | 'show'
  speaker?: string
}

export type Attendee = {
  id: string
  name: string
  type: AttendeeType
  phone: string
  email: string
  age?: number
  occupation?: string
  /** บริษัท / หน่วยงาน (กรอกเฉพาะอาชีพที่สังกัดองค์กร) */
  organization?: string
  province: string
  registeredAt: string
  checkedInAt?: string
  interests?: string[]
  activities?: string[]
  wantsMatching?: boolean
}

export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type MeetingOutcome = 'interested' | 'followup' | 'deal' | 'nodeal'

export type Meeting = {
  id: string
  exhibitorId: string
  buyerId: string
  day: 1 | 2 | 3
  time: string
  table: string
  objective: 'distribution' | 'partnership' | 'export' | 'procurement'
  status: MeetingStatus
  note?: string
  result?: {
    outcome: MeetingOutcome
    dealValue: number
    forecast: number
    note: string
    savedAt: string
  }
}

export type SurveyResponse = {
  id: string
  scores: Record<string, number>
  nps: number
  comment: string
  at: string
}
