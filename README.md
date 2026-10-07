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
| Check-in (Staff) | Scanner (กล้อง + จำลองการสแกน + ค้นหาด้วยตนเอง), ผลการเช็คอิน, Check-in Dashboard | `/staff/scan`, `/staff/scan/:id`, `/staff/dashboard` |
| Business Matching | ค้นหา Buyer, ขอนัดหมาย, My Meetings (Timeline), บันทึกผลการประชุม | `/matching`, `/matching/request/:buyerId`, `/matching/meetings`, `/matching/meetings/:id/result` |
| Survey | ความพึงพอใจ 6 หัวข้อ + NPS | `/survey` |
| Admin | Dashboard, Attendee, Exhibitor, Business Matching, Report & Export (.xlsx) | `/admin`, `/admin/attendees`, `/admin/exhibitors`, `/admin/matching`, `/admin/reports` |
| Concept | Ask MOC AI (Avatar + Chat ตอบจากข้อมูลในระบบ ไม่ได้ต่อ LLM จริง) | `/ai` |
| Presenter | เส้นทางเดโม (Story 10–15 นาที) | `/demo` |

ปุ่ม **Demo** ลอยมุมขวาล่างใช้สลับบทบาท (ผู้เข้าชม / เจ้าหน้าที่ / SME / ผู้จัดงาน), สลับภาษา TH/EN และ **รีเซ็ตข้อมูลเดโม**

## Demo Script (แนะนำ)

1. **Visitor**: Home → ลงทะเบียน (กด “กรอกข้อมูลตัวอย่าง”) → ได้ QR Ticket
2. **Staff**: เปิดแอปสแกน → “จำลองการสแกน” → ยืนยันเช็คอิน
3. **Visitor**: ค้นหาผู้ออกบูธ → ดู e-Catalog → Floor Plan
4. **SME**: Business Matching → ขอนัด Buyer → บันทึกผล “ปิดดีล” ฿500,000 / Forecast ฿2,000,000
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

## Booth owner / Visitor leads

Open `/booth` (GitHub Pages: `/#/booth`) or choose **เจ้าของบูธ / Booth owner** in the floating Demo menu.
Select an approved booth, scan the visitor's existing registration QR ticket, review their details, then confirm the record.
Camera scanning, demo simulation, and manual lookup are supported. Mark the visitor as visited, interested, or follow up and add notes.
The lead list and Excel export contain only the selected booth's visitors. Scanning the same ticket again updates the existing record; the same attendee can visit different booths.
Booth scans do not change event check-in status or attendance KPIs. Leads persist in this browser and are cleared by Reset demo data.
This is a demo booth selector, without owner authentication or cross-device synchronization. A production implementation needs authenticated booth ownership and server-side lead storage/access control.
