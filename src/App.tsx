import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { StaffLayout } from './layouts/StaffLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { DemoNav } from './layouts/DemoNav'
import HomePage from './pages/public/HomePage'
const BoothPage = lazy(() => import('./pages/booth/BoothPage'))
const EventPage = lazy(() => import('./pages/public/EventPage'))
const SchedulePage = lazy(() => import('./pages/public/SchedulePage'))
const ExhibitorsPage = lazy(() => import('./pages/public/ExhibitorsPage'))
const ExhibitorDetailPage = lazy(() => import('./pages/public/ExhibitorDetailPage'))
const FloorPlanPage = lazy(() => import('./pages/public/FloorPlanPage'))
const DemoStoryPage = lazy(() => import('./pages/public/DemoStoryPage'))
const RegisterPage = lazy(() => import('./pages/register/RegisterPage'))
const RegisterSuccessPage = lazy(() => import('./pages/register/RegisterSuccessPage'))
const ScannerPage = lazy(() => import('./pages/checkin/ScannerPage'))
const CheckinResultPage = lazy(() => import('./pages/checkin/CheckinResultPage'))
const CheckinDashboardPage = lazy(() => import('./pages/checkin/CheckinDashboardPage'))
const MatchingLayout = lazy(() => import('./pages/matching/MatchingLayout'))
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

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="booth" element={<BoothPage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="exhibitors" element={<ExhibitorsPage />} />
          <Route path="exhibitors/:id" element={<ExhibitorDetailPage />} />
          <Route path="floorplan" element={<FloorPlanPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register/success/:id" element={<RegisterSuccessPage />} />
          <Route path="survey" element={<SurveyPage />} />
          <Route path="ai" element={<AskAiPage />} />
          <Route path="demo" element={<DemoStoryPage />} />
          <Route path="matching" element={<MatchingLayout />}>
            <Route index element={<DiscoveryPage />} />
            <Route path="request/:buyerId" element={<RequestMeetingPage />} />
            <Route path="meetings" element={<MyMeetingsPage />} />
            <Route path="meetings/:id/result" element={<MeetingResultPage />} />
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
