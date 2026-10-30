# MOC Expo 2026 — Software Demo (Web Prototype)

ต้นแบบซอฟต์แวร์สำหรับนำเสนอลูกค้า ครอบคลุม Journey หลักของงาน
**ก่อนงาน → วันงาน → หลังงาน** และ KPI เศรษฐกิจ (ผู้เข้างาน → SME → Matching → ยอดขาย/ดีล → Economic Impact)

ข้อมูลงานอ้างอิงเอกสารโครงการ: **4–6 ธันวาคม 2569 · QSNCC Hall 7–8** · 3 โซนหลัก (MOC HUB / MOC UP SKILL / MOC TASTE)
+ Business Matching Lounge, Workshop, Private Pavilion · เป้าหมายผู้เข้าร่วม 8,000 ราย และมูลค่าทางเศรษฐกิจ 100 ล้านบาท (งบประมาณ 25 ล้านบาท)
ธีมสีและโลโก้ใช้ตาม CI ของงาน (น้ำเงินกรมท่า + ทอง) ไฟล์โลโก้อยู่ที่ `src/assets/brand/`

> รายชื่อผู้ประกอบการ, Buyer, ผู้ลงทะเบียน และตัวเลข KPI เป็น **ข้อมูลสมมติ** สำหรับการสาธิตเท่านั้น
> ไม่มี backend — ข้อมูลที่กรอกระหว่างเดโมจะถูกเก็บใน `localStorage` ของเบราว์เซอร์เครื่องนั้น

## หน้าจอทั้งหมด

| กลุ่ม | หน้า | Route |
|---|---|---|
| Public | Home, About/Event, Schedule, Exhibitor Directory, Exhibitor Detail (e-Catalog), Floor Plan | `/`, `/event`, `/schedule`, `/exhibitors`, `/exhibitors/:id`, `/floorplan` |
| Registration | ฟอร์ม 2 ขั้นตอน, Success + QR Ticket (Download QR / Add to Calendar) | `/register`, `/register/success/:id` |
| Exhibitor Registration | ลงทะเบียนผู้ประกอบการ 3 ขั้นตอน: ข้อมูลร้าน → การตลาด + ยืนยันลงทะเบียน → เพิ่มสินค้า e-Catalog (ข้ามได้) | `/register/exhibitor` |
| SME Portal (ร้านค้าของฉัน) | Login ด้วยอีเมล/เบอร์ + OTP, ภาพรวม, สินค้า e-Catalog, ข้อมูลร้านค้า, Business Matching (ค้นหา Buyer, ขอนัดหมาย, My Meetings, บันทึกผล), ผู้เยี่ยมชมบูธ | `/portal/login`, `/portal`, `/portal/products`, `/portal/shop`, `/portal/matching/*`, `/portal/booth` |
| Check-in (Staff) | Scanner (กล้อง + จำลองการสแกน + ค้นหาด้วยตนเอง), ผลการเช็คอิน, Check-in Dashboard | `/staff/scan`, `/staff/scan/:id`, `/staff/dashboard` |
| Survey | ความพึงพอใจ 6 หัวข้อ + NPS | `/survey` |
| Admin | Dashboard, Attendee, Exhibitor, Business Matching, Report & Export (.xlsx) | `/admin`, `/admin/attendees`, `/admin/exhibitors`, `/admin/matching`, `/admin/reports` |
| Concept | Ask MOC AI (Avatar + Chat ตอบจากข้อมูลในระบบ ไม่ได้ต่อ LLM จริง) | `/ai` |
| Presenter | เส้นทางเดโม (Story 10–15 นาที) | `/demo` |

ปุ่ม **Demo** ลอยมุมขวาล่างใช้สลับบทบาท (ผู้เข้าชม / ร้านค้า (SME) / เจ้าหน้าที่ / ผู้จัดงาน), สลับภาษา TH/EN และ **รีเซ็ตข้อมูลเดโม**

ลิงก์เดิม `/matching/*` และ `/booth` จะพาไปที่ `/portal/matching/*` และ `/portal/booth` อัตโนมัติ

## Demo Script (แนะนำ)

1. **Visitor**: Home → ลงทะเบียน (กด “กรอกข้อมูลตัวอย่าง”) → ได้ QR Ticket
2. **Staff**: เปิดแอปสแกน → “จำลองการสแกน” → ยืนยันเช็คอิน
3. **Visitor**: ค้นหาผู้ออกบูธ → ดู e-Catalog → Floor Plan
4. **SME**: ร้านค้าของฉัน → เข้าสู่ระบบ (ใช้บัญชีร้านตัวอย่าง, OTP เดโม `246810`) → Business Matching → ขอนัด Buyer → บันทึกผล “ปิดดีล” ฿500,000 / Forecast ฿2,000,000
5. **Visitor**: ทำแบบสอบถาม
6. **Organizer**: Admin Dashboard (ตัวเลขขยับตามที่ทำสด: Registered/Checked-in/Deal Value) → Attendee → Matching → Report → Export Excel

## พัฒนาและรันในเครื่อง

```bash
npm install
npm run dev        # http://localhost:5173/moc/
npm run build      # typecheck + build ไปที่ dist/
npm run preview    # ทดสอบไฟล์ build
```

Tech stack: Vite + React + TypeScript, Tailwind CSS v4, React Router (HashRouter), Zustand, Recharts, qrcode.react, html5-qrcode, write-excel-file

## เผยแพร่บน GitHub Pages

Workflow `.github/workflows/deploy.yml` จะ build และ deploy อัตโนมัติเมื่อ push เข้า `main`

ตั้งค่าครั้งแรก:
1. ตั้ง repository เป็น **Public** (Settings → General → Danger Zone → Change visibility) หรือใช้แผนที่รองรับ Pages สำหรับ private repo
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**
3. Merge โค้ดเข้า `main` แล้วเปิด `https://<owner>.github.io/moc/`

ถ้าชื่อ repo ไม่ใช่ `moc` ให้ตั้ง environment variable `VITE_BASE=/<ชื่อ-repo>/` ตอน build

## SME Portal (ร้านค้าของฉัน)

ผู้ประกอบการลงทะเบียนที่ `/register/exhibitor` แล้วเข้าสู่ระบบที่ `/portal/login` ทุกอย่างของร้านอยู่หลัง login เดียว:

- **ภาพรวม**: ตัวเลขสรุป นัดหมายที่ใกล้ถึง Buyer ที่แนะนำ รายการความพร้อมก่อนวันงาน และข้อมูลบูธ
- **สินค้า (e-Catalog)**: เพิ่ม/แก้ไข/ซ่อน/ลบสินค้า ฟอร์มแยกแท็บไทย/English พร้อมตัวอย่างการ์ด e-Catalog (เลขบนช่องกรอกตรงกับเลขบนการ์ด) สินค้าแสดงบนหน้าร้านเมื่อกรอกครบทั้ง 2 ภาษาและมีรูป
- **ข้อมูลร้านค้า**: ฟอร์มชุดเดียวกับตอนลงทะเบียน รวมโลโก้ เอกสาร และสวิตช์เข้าร่วม Business Matching
- **Business Matching**: ร้านที่ไม่ได้เข้าร่วมจะเห็นหน้าเชิญเข้าร่วม ร้านที่เข้าร่วมแล้วค้นหา Buyer / ขอนัด / ดูนัดหมาย / บันทึกผล
- **ผู้เยี่ยมชมบูธ**: สแกน QR Ticket ของผู้เข้างานให้บูธของร้านที่ login อยู่ (ดูรายละเอียดด้านล่าง) ร้านที่ยังรออนุมัติบูธจะยังสแกนไม่ได้

เดโมไม่ได้ส่ง OTP จริง ใช้รหัส `246810` หรือปุ่ม “เข้าสู่ระบบด้วย SME ONE ID” ซึ่งเข้าเป็นร้านตัวอย่าง ข้อมูลที่ร้านแก้ไข (รวมรูปที่อัปโหลด ย่อเหลือไม่เกิน 640 px) เก็บใน `localStorage` ของเบราว์เซอร์ ระบบจริงต้องมี OTP, การยืนยันตัวตน และ storage ฝั่ง server

## Booth owner / Visitor leads

Open `/portal/booth` (GitHub Pages: `/#/portal/booth`; the old `/booth` link redirects there) or choose **ร้านค้า (SME)** in the floating Demo menu and open the **ผู้เยี่ยมชมบูธ** tab.
The booth is the logged-in shop's booth. Scan the visitor's existing registration QR ticket, review their details, tag products of interest from the shop's e-Catalog, then confirm the record.
Camera scanning, demo simulation, and manual lookup are supported. Mark the visitor as visited, interested, or follow up and add notes.
The lead list and Excel export contain only the selected booth's visitors. Scanning the same ticket again updates the existing record; the same attendee can visit different booths.
Booth scans do not change event check-in status or attendance KPIs. Leads persist in this browser and are cleared by Reset demo data.
The demo login has no real authentication or cross-device synchronization. A production implementation needs authenticated booth ownership and server-side lead storage/access control.
