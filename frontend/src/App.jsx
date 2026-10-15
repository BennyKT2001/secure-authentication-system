import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import VerifyLoginOtpPage from './pages/auth/VerifyLoginOtpPage.jsx';
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AssetInventoryPage from "./pages/admin/AssetInventoryPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import VerifyRegistrationOtpPage from "./pages/auth/VerifyRegistrationOtpPage.jsx";

function ComingSoonPage({ title }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-margin">
      <section className="max-w-md rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-lg">
        <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
          AssetGuard
        </p>

        <h1 className="mt-space-sm text-headline-lg font-headline-lg text-on-surface">
          {title}
        </h1>

        <p className="mt-space-sm text-body-md text-on-surface-variant">
          This screen will be implemented in the next authentication section.
        </p>

        <Link to="/" className="mt-space-lg inline-flex rounded-lg bg-secondary px-space-lg py-space-sm text-label-md font-label-md text-on-secondary transition-colors hover:bg-secondary-container" >
          Back to home
        </Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtpPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-registration-otp" element={<VerifyRegistrationOtpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/assets" element={<AssetInventoryPage />} />
          </Route>
        </Route>

        <Route path="/register" element={<ComingSoonPage title="Create your AssetGuard account" />} />

        <Route path="*" element={<ComingSoonPage title="Page not found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;