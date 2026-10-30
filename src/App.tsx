import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { StaffLayout } from './layouts/StaffLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { DemoNav } from './layouts/DemoNav'
import HomePage from './pages/public/HomePage'
const EventPage = lazy(() => import('./pages/public/EventPage'))
const SchedulePage = lazy(() => import('./pages/public/SchedulePage'))
const ExhibitorsPage = lazy(() => import('./pages/public/ExhibitorsPage'))
const ExhibitorDetailPage = lazy(() => import('./pages/public/ExhibitorDetailPage'))
const FloorPlanPage = lazy(() => import('./pages/public/FloorPlanPage'))
const DemoStoryPage = lazy(() => import('./pages/public/DemoStoryPage'))
const RegisterPage = lazy(() => import('./pages/register/RegisterPage'))
const RegisterSuccessPage = lazy(() => import('./pages/register/RegisterSuccessPage'))
const ExhibitorRegisterPage = lazy(() => import('./pages/register/ExhibitorRegisterPage'))
const ScannerPage = lazy(() => import('./pages/checkin/ScannerPage'))
const CheckinResultPage = lazy(() => import('./pages/checkin/CheckinResultPage'))
const CheckinDashboardPage = lazy(() => import('./pages/checkin/CheckinDashboardPage'))
const PortalLoginPage = lazy(() => import('./pages/portal/PortalLoginPage'))
const PortalLayout = lazy(() => import('./pages/portal/PortalLayout'))
const OverviewPage = lazy(() => import('./pages/portal/OverviewPage'))
const ProductsPage = lazy(() => import('./pages/portal/ProductsPage'))
const ShopInfoPage = lazy(() => import('./pages/portal/ShopInfoPage'))
const MatchingSection = lazy(() => import('./pages/portal/MatchingSection'))
const BoothPage = lazy(() => import('./pages/portal/BoothPage'))
const DiscoveryPage = lazy(() => import('./pages/matching/DiscoveryPage'))
const RequestMeetingPage = lazy(() => import('./pages/matching/RequestMeetingPage'))
const MyMeetingsPage = lazy(() => import('./pages/matching/MyMeetingsPage'))
const MeetingResultPage = lazy(() => import('./pages/matching/MeetingResultPage'))
const SurveyPage = lazy(() => import('./pages/survey/SurveyPage'))
const AskAiPage = lazy(() => import('./pages/ai/AskAiPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AttendeesPage = lazy(() => import('./pages/admin/AttendeesPage'))
const AdminExhibitorsPage = lazy(() => import('./pages/admin/AdminExhibitorsPage'))
const AdminMatchingPage = lazy(() => import('./pages/admin/AdminMatchingPage'))
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'))

/** ลิงก์เดิม /matching/* และ /booth ย้ายเข้า SME Portal แล้ว */
function LegacyRedirect({ to }: { to: string }) {
  const { '*': rest = '' } = useParams()
  return <Navigate to={rest ? `${to}/${rest}` : to} replace />
}

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="booth" element={<Navigate to="/portal/booth" replace />} />
          <Route path="event" element={<EventPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="exhibitors" element={<ExhibitorsPage />} />
          <Route path="exhibitors/:id" element={<ExhibitorDetailPage />} />
          <Route path="floorplan" element={<FloorPlanPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register/success/:id" element={<RegisterSuccessPage />} />
          <Route path="register/exhibitor" element={<ExhibitorRegisterPage />} />
          <Route path="survey" element={<SurveyPage />} />
          <Route path="ai" element={<AskAiPage />} />
          <Route path="demo" element={<DemoStoryPage />} />
          <Route path="matching/*" element={<LegacyRedirect to="/portal/matching" />} />
          <Route path="portal/login" element={<PortalLoginPage />} />
          <Route path="portal" element={<PortalLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="shop" element={<ShopInfoPage />} />
            <Route path="matching" element={<MatchingSection />}>
              <Route index element={<DiscoveryPage />} />
              <Route path="request/:buyerId" element={<RequestMeetingPage />} />
              <Route path="meetings" element={<MyMeetingsPage />} />
              <Route path="meetings/:id/result" element={<MeetingResultPage />} />
            </Route>
            <Route path="booth" element={<BoothPage />} />
          </Route>
        </Route>
        <Route path="staff" element={<StaffLayout />}>
          <Route index element={<Navigate to="scan" replace />} />
          <Route path="scan" element={<ScannerPage />} />
          <Route path="scan/:id" element={<CheckinResultPage />} />
          <Route path="dashboard" element={<CheckinDashboardPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="attendees" element={<AttendeesPage />} />
          <Route path="exhibitors" element={<AdminExhibitorsPage />} />
          <Route path="matching" element={<AdminMatchingPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DemoNav />
    </Suspense>
  )
}
