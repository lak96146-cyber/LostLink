import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LinkBotWidget } from './components/LinkBotWidget';

// Student & Public Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OverviewPage } from './pages/OverviewPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { SmartMatchPage } from './pages/SmartMatchPage';
import { CampusVersePage } from './pages/CampusVersePage';
import { VaultPage } from './pages/VaultPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { RecoveryJourneyPage } from './pages/RecoveryJourneyPage';
import { CommunityPage } from './pages/CommunityPage';

// Guardian / Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminClaimsPage } from './pages/AdminClaimsPage';
import { AdminLockersPage } from './pages/AdminLockersPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#142B38] flex flex-col items-center justify-center text-sand">
        <div className="w-10 h-10 border-2 border-teal-brand border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono uppercase tracking-widest text-mint/80">
          Authenticating LostLink Session...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isCampusVerse = location.pathname === '/campusverse';

  if (isAuthPage) {
    return <div className="min-h-screen bg-[#142B38] text-cream">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#142B38] text-cream flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={`flex-1 transition-all duration-200 lg:pl-64 ${isCampusVerse ? 'p-2 sm:p-4' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'}`}>
          {children}
        </main>
      </div>

      <LinkBotWidget />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student & Ecosystem Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <OverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/overview"
              element={
                <ProtectedRoute>
                  <OverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <DiscoverPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-lost"
              element={
                <ProtectedRoute>
                  <ReportLostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-found"
              element={
                <ProtectedRoute>
                  <ReportFoundPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smartmatch"
              element={
                <ProtectedRoute>
                  <SmartMatchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smart-match"
              element={
                <ProtectedRoute>
                  <SmartMatchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campusverse"
              element={
                <ProtectedRoute>
                  <CampusVersePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault"
              element={
                <ProtectedRoute>
                  <VaultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <ProtectedRoute>
                  <ClaimsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-claims"
              element={
                <ProtectedRoute>
                  <ClaimsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recovery"
              element={
                <ProtectedRoute>
                  <RecoveryJourneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recovery-journey"
              element={
                <ProtectedRoute>
                  <RecoveryJourneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />

            {/* Guardian / Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/claims"
              element={
                <ProtectedRoute adminOnly>
                  <AdminClaimsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/lockers"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLockersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute adminOnly>
                  <AdminAuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
