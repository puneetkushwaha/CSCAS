import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Exam from './pages/Exam';
import ExamPlayer from './pages/ExamPlayer';
import PearsonDashboard from './pages/PearsonDashboard';
import FindExam from './pages/FindExam';
import SelectExamOptions from './pages/SelectExamOptions';
import SelectExamLanguage from './pages/SelectExamLanguage';
import ProvideAdditionalInfo from './pages/ProvideAdditionalInfo';
import TestingPolicies from './pages/TestingPolicies';
import SelectProctorLanguage from './pages/SelectProctorLanguage';
import FindAppointment from './pages/FindAppointment';
import ReviewBooking from './pages/ReviewBooking';
import PaymentSuccess from './pages/PaymentSuccess';

import Careers from './pages/Careers';
import CareersPlus from './pages/CareersPlus';
import TechCareers from './pages/TechCareers';
import IndustrySectors from './pages/IndustrySectors';
import PartnersEcosystem from './pages/PartnersEcosystem';
import Academic from './pages/Academic';
import AcademicPrograms from './pages/AcademicPrograms';
import Resources from './pages/Resources';
import Certifications from './pages/Certifications';
import Profile from './pages/Profile';
import AccountIntel from './pages/AccountIntel';
import AdditionalInfo from './pages/AdditionalInfo';
import RegistryPreferences from './pages/RegistryPreferences';
import ExamHistory from './pages/ExamHistory';
import ScoreReports from './pages/ScoreReports';
import PaymentReceipts from './pages/PaymentReceipts';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ExamControl from './pages/Admin/ExamControl';
import UserManagement from './pages/Admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawer /> {/* CartDrawer is now a direct child of CartProvider, outside Router */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />

            {/* Nested Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="certifications" element={<Certifications />} />
              <Route path="exam" element={<Exam />} />
              <Route path="exam-player" element={<ExamPlayer />} />

              <Route path="find-exam" element={<FindExam />} />
              <Route path="select-exam-options" element={<SelectExamOptions />} />
              <Route path="select-exam-language" element={<SelectExamLanguage />} />
              <Route path="provide-additional-info" element={<ProvideAdditionalInfo />} />
              <Route path="testing-policies" element={<TestingPolicies />} />
              <Route path="select-proctor-language" element={<SelectProctorLanguage />} />
              <Route path="find-appointment" element={<FindAppointment />} />
              <Route path="review-booking" element={<ReviewBooking />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="pearson" element={<PearsonDashboard />} />
              <Route path="account-intel" element={<AccountIntel />} />
              <Route path="additional-info" element={<AdditionalInfo />} />
              <Route path="registry-preferences" element={<RegistryPreferences />} />
              <Route path="exam-history" element={<ExamHistory />} />
              <Route path="score-reports" element={<ScoreReports />} />
              <Route path="payment-receipts" element={<PaymentReceipts />} />
            </Route>

            <Route path="/profile" element={<Profile />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers-plus" element={<CareersPlus />} />
            <Route path="/tech-careers" element={<TechCareers />} />
            <Route path="/industry-sectors" element={<IndustrySectors />} />
            <Route path="/partners" element={<PartnersEcosystem />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/academic-catalog" element={<AcademicPrograms />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/certifications" element={<Certifications />} />

            {/* Other Dashboard-linked routes outside nested structure if needed */}
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam-player" element={<ExamPlayer />} />

            <Route path="/pearson-dashboard" element={<PearsonDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="exams" element={<ExamControl />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;