import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'
import LoginPage from './pages/LoginPage'
import AppShell from './components/layout/AppShell'
import Toast from './components/ui/Toast'

// Manager pages
import OverviewPage from './pages/manager/OverviewPage'
import DigitalTwinPage from './pages/manager/DigitalTwinPage'
import AIDecisionsPage from './pages/manager/AIDecisionsPage'
import OperationsPage from './pages/manager/OperationsPage'
import ManagerSafetyPage from './pages/manager/ManagerSafetyPage'
import BusinessIntelligencePage from './pages/manager/BusinessIntelligencePage'
import SettingsPage from './pages/manager/SettingsPage'

// Dispatcher pages
import DispatchOverviewPage from './pages/dispatcher/DispatchOverviewPage'
import AIDispatcherPage from './pages/dispatcher/AIDispatcherPage'
import JobsTripsPage from './pages/dispatcher/JobsTripsPage'
import FleetAvailabilityPage from './pages/dispatcher/FleetAvailabilityPage'
import ReturnLoadPage from './pages/dispatcher/ReturnLoadPage'
import LiveMapPage from './pages/dispatcher/LiveMapPage'
import DispatchHistoryPage from './pages/dispatcher/DispatchHistoryPage'

// Safety pages
import SafetyOverviewPage from './pages/safety/SafetyOverviewPage'
import IncidentsPage from './pages/safety/IncidentsPage'
import DriverSafetyPage from './pages/safety/DriverSafetyPage'
import VehicleCompliancePage from './pages/safety/VehicleCompliancePage'
import RiskMonitoringPage from './pages/safety/RiskMonitoringPage'
import RiskTrendsPage from './pages/safety/RiskTrendsPage'
import SafetyReportsPage from './pages/safety/SafetyReportsPage'

// Analyst pages
import AnalyticsOverviewPage from './pages/analyst/AnalyticsOverviewPage'
import FleetPerformancePage from './pages/analyst/FleetPerformancePage'
import CostProfitabilityPage from './pages/analyst/CostProfitabilityPage'
import DeliveryAnalysisPage from './pages/analyst/DeliveryAnalysisPage'
import EmptyReturnPage from './pages/analyst/EmptyReturnPage'
import AIEffectivenessPage from './pages/analyst/AIEffectivenessPage'
import AnalystReportsPage from './pages/analyst/AnalystReportsPage'

function ProtectedLayout() {
  const role = useAppStore(s => s.currentRole)
  if (!role) return <Navigate to="/" replace />
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function RoleGuard({ role }: { role: string }) {
  const currentRole = useAppStore(s => s.currentRole)
  if (!currentRole) return <Navigate to="/" replace />
  if (currentRole !== role) return <Navigate to={`/${currentRole}/overview`} replace />
  return <Outlet />
}

export default function App() {
  const toast = useAppStore(s => s.toast)

  return (
    <BrowserRouter>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <Routes>
        <Route path="/" element={<LoginRoot />} />

        {/* Manager workspace */}
        <Route element={<ProtectedLayout />}>
          <Route element={<RoleGuard role="manager" />}>
            <Route path="/manager" element={<Navigate to="/manager/overview" replace />} />
            <Route path="/manager/overview" element={<OverviewPage />} />
            <Route path="/manager/digital-twin" element={<DigitalTwinPage />} />
            <Route path="/manager/ai-decisions" element={<AIDecisionsPage />} />
            <Route path="/manager/operations" element={<OperationsPage />} />
            <Route path="/manager/safety" element={<ManagerSafetyPage />} />
            <Route path="/manager/intelligence" element={<BusinessIntelligencePage />} />
            <Route path="/manager/settings" element={<SettingsPage />} />
          </Route>

          {/* Dispatcher workspace */}
          <Route element={<RoleGuard role="dispatcher" />}>
            <Route path="/dispatcher" element={<Navigate to="/dispatcher/overview" replace />} />
            <Route path="/dispatcher/overview" element={<DispatchOverviewPage />} />
            <Route path="/dispatcher/ai-dispatcher" element={<AIDispatcherPage />} />
            <Route path="/dispatcher/map" element={<LiveMapPage />} />
            <Route path="/dispatcher/jobs" element={<JobsTripsPage />} />
            <Route path="/dispatcher/fleet" element={<FleetAvailabilityPage />} />
            <Route path="/dispatcher/return-load" element={<ReturnLoadPage />} />
            <Route path="/dispatcher/history" element={<DispatchHistoryPage />} />
          </Route>

          {/* Safety workspace */}
          <Route element={<RoleGuard role="safety" />}>
            <Route path="/safety" element={<Navigate to="/safety/overview" replace />} />
            <Route path="/safety/overview" element={<SafetyOverviewPage />} />
            <Route path="/safety/incidents" element={<IncidentsPage />} />
            <Route path="/safety/drivers" element={<DriverSafetyPage />} />
            <Route path="/safety/compliance" element={<VehicleCompliancePage />} />
            <Route path="/safety/risk" element={<RiskMonitoringPage />} />
            <Route path="/safety/trends" element={<RiskTrendsPage />} />
            <Route path="/safety/reports" element={<SafetyReportsPage />} />
          </Route>

          {/* Analyst workspace */}
          <Route element={<RoleGuard role="analyst" />}>
            <Route path="/analyst" element={<Navigate to="/analyst/overview" replace />} />
            <Route path="/analyst/overview" element={<AnalyticsOverviewPage />} />
            <Route path="/analyst/fleet-performance" element={<FleetPerformancePage />} />
            <Route path="/analyst/costs" element={<CostProfitabilityPage />} />
            <Route path="/analyst/delivery" element={<DeliveryAnalysisPage />} />
            <Route path="/analyst/empty-return" element={<EmptyReturnPage />} />
            <Route path="/analyst/ai-effectiveness" element={<AIEffectivenessPage />} />
            <Route path="/analyst/reports" element={<AnalystReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function LoginRoot() {
  const role = useAppStore(s => s.currentRole)
  if (role) return <Navigate to={`/${role}/overview`} replace />
  return <LoginPage />
}
