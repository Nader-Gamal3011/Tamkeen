import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Doctor
import DoctorDashboard from "./pages/Doctor/Doctor_Dashboard";
import DoctorAppointments from "./pages/Doctor/Doctor_Appointments";
import DoctorPatientDetails from "./pages/Doctor/DoctorPatientDetails";
import DoctorSetting from "./components/DoctorSetting";

// Reception
import ReceptionDashboard from "./pages/Reception/Reception_Dashboard";
import Reception_PatientManagement from "./pages/Reception/Reception_PatientManagement";
import Reception_Appointments from "./pages/Reception/Reception_Appointments";
import Reception_QueueManagement from "./pages/Reception/Reception_QueueManagement";
import Reception_PatientDetails from "./pages/Reception/Reception_PatientDetails";
import Reception_BookingRequests from "./pages/Reception/Reception_BookingRequests";

// Admin
import Admin_Dashboard from "./pages/Admin/Admin_Dashboard";
import Admin_PendingAccounts from "./pages/Admin/Admin_PendingAccounts";
import Admin_UserManagement from "./pages/Admin/Admin_UserManagement";
import Admin_CreateStaff from "./pages/Admin/Admin_CreateStaff";
import Admin_DoctorsSchedule from "./pages/Admin/Admin_DoctorsSchedule";
import Admin_ActivityReports from "./pages/Admin/Admin_ActivityReports";
import Admin_DoctorManagement from "./pages/Admin/Admin_DoctorManagement";
import Admin_PatientManagement from "./pages/Admin/Admin_PatientManagement";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients/:_id" element={<DoctorPatientDetails />} />
        <Route path="settings" element={<DoctorSetting />} />
      </Route>

      {/* Reception Routes */}
      <Route
        path="/reception"
        element={
          <ProtectedRoute allowedRole="receptionist">
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<ReceptionDashboard />} />

        <Route path="patients" element={<Reception_PatientManagement />} />

        <Route path="appoints" element={<Reception_Appointments />} />

        <Route path="queue" element={<Reception_QueueManagement />} />

        <Route path="patients/:id" element={<Reception_PatientDetails />} />

        <Route
          path="booking-requests"
          element={<Reception_BookingRequests />}
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Admin_Dashboard />} />
        <Route path="pending-accounts" element={<Admin_PendingAccounts />} />
        <Route path="users" element={<Admin_UserManagement />} />
        <Route path="create-staff" element={<Admin_CreateStaff />} />
        <Route path="doctors-schedule" element={<Admin_DoctorsSchedule />} />
        <Route path="activity" element={<Admin_ActivityReports />} />
        <Route path="doctors" element={<Admin_DoctorManagement />} />
        <Route path="patients" element={<Admin_PatientManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
