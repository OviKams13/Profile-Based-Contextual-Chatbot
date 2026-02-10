import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import SimpleLayout from './components/Layout/SimpleLayout';
import SidebarLayout from './components/Layout/SidebarLayout';
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProgramsPage from './pages/admin/ProgramsPage';
import AdminApplicationsPage from './pages/admin/ApplicationsPage';
import ApplicantSignup from './pages/applicant/ApplicantSignup';
import ApplicantLogin from './pages/applicant/ApplicantLogin';
import ApplicantProgramsPage from './pages/applicant/ProgramsPage';
import ProgramDetail from './pages/applicant/ProgramDetail';
import ApplicationForm from './pages/applicant/ApplicationForm';
import MyApplications from './pages/applicant/MyApplications';

export default function App() {
  return (
    <SimpleLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/applicant/signup" element={<ApplicantSignup />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />
        <Route path="/programs" element={<ApplicantProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetail />} />

        <Route element={<ProtectedRoute role="applicant" />}>
          <Route path="/apply/:programId" element={<ApplicationForm />} />
          <Route path="/me/applications" element={<MyApplications />} />
        </Route>

        <Route element={<ProtectedRoute role="dean" />}>
          <Route path="/admin" element={<SidebarLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="programs" element={<AdminProgramsPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SimpleLayout>
  );
}
