import type { LText } from '../../i18n/I18nProvider'

/** ข้อมูลที่หน้าแรกของทุกธีมใช้ร่วมกัน */
export const HOME_ZONES: { name: string; to: string; title: LText; desc: LText }[] = [
  { name: 'MOC HUB', to: '/exhibitors?pavilion=hub', title: { th: 'Pavilion สินค้าและบริการให้คำปรึกษา', en: 'Products & advisory pavilion' }, desc: { th: 'จัดแสดงและจำหน่ายสินค้าจาก 9 หน่วยงานกระทรวงพาณิชย์ ผู้ประกอบการ 200 ราย พร้อมบริการให้คำปรึกษาจาก 14 หน่วยงาน', en: 'Products from 200 SMEs under 9 MOC agencies, plus advisory services from 14 agencies' } },
  { name: 'MOC UP SKILL', to: '/schedule', title: { th: 'เสริมทักษะ องค์ความรู้ และสาระบันเทิง', en: 'Skills, knowledge & edutainment' }, desc: { th: 'เวทีถ่ายทอดความรู้จากผู้เชี่ยวชาญและอินฟลูเอนเซอร์ ตั้งแต่คอนเทนต์ การตลาด สร้างแบรนด์ ถึงการดึงดูดนักลงทุน', en: 'Talks from experts and influencers: content, marketing, branding, trends and attracting investors' } },
  { name: 'MOC TASTE', to: '/exhibitors?pavilion=taste', title: { th: 'ช้อปชิมอาหารเด็ด', en: 'Shop & taste signature food' }, desc: { th: 'ร้านอาหารและเครื่องดื่มชื่อดัง 100 บูธ ทั้งร้านรางวัล ร้านดารา ร้านอินฟลูเอนเซอร์ และร้านเชฟชื่อดัง', en: '100 famous food & drink booths: award winners, celebrity, influencer and chef shops' } },
]

export const HOME_SPEAKERS: { name: string; role: LText }[] = [
  { name: 'Dr. Pimchanok S.', role: { th: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', en: 'Digital marketing expert' } },
  { name: 'Kenji Tanaka', role: { th: 'ผู้นำเข้าอาหาร ประเทศญี่ปุ่น', en: 'Food importer, Japan' } },
  { name: 'Mint & Friends', role: { th: 'อินฟลูเอนเซอร์สายรีวิวสินค้า', en: 'Product review influencers' } },
  { name: 'Arthit W.', role: { th: 'ผู้ก่อตั้งแบรนด์ 300 สาขา', en: 'Founder, 300-branch brand' } },
]

export const HOME_FEATURED = ['thai-organic-farm', 'lanna-coffee', 'khao-soi-chef', 'indigo-weave']
