import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './Component/DashboardLayout.jsx';
import Dashboard from './Component/Dashboard/Dashboard.jsx';
import ClientsList from './Component/Pages/ClientsList.jsx';
import PCNsList from './Component/Pages/PCNsList.jsx';
import PracticesList from './Component/Pages/PracticesList.jsx';
import PCNProfile from './Component/Pages/PCNProfile.jsx';
import PracticeProfile from './Component/Pages/PracticeProfile.jsx';
import StaffList from './Component/Pages/Staff/Stafflist.jsx';
import StaffDetails from './Component/Pages/Staff/StaffDetails.jsx';
import RotaManagement from './Component/Pages/RotaManagement/RotaMaegment.jsx';
import LeaveList from './Component/Pages/Leave/LeaveList.jsx';
import LeaveDetails from './Component/Pages/Leave/LeaveDetails.jsx';
import AddLeaveRequest from './Component/Pages/Leave/AddLeaveRequest.jsx';
import ComplianceDashboard from './Component/ComplianceDashboard.jsx';
import PCNDashboard from './Component/Dashboard/PCNDashboard.jsx';
import Invoices from './Component/Pages/Invoices.jsx';
import Announcements from './Component/Pages/Announcements.jsx';
import AttendanceEmployee from './Component/Pages/Staff/AttendanceEmployee.jsx';
import Login from './Component/Pages/Auth/Login.jsx';

// Under Construction fallback component
const UnderConstruction = ({ pageName }) => (
  <div className="bg-secondary rounded-xl p-12 text-center shadow-sm">
    <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-primary mb-2">
      {pageName}
    </h2>
    <p className="text-secondary">This page is under construction</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login - outside DashboardLayout */}
        <Route path="/login" element={<Login />} />

        {/* All dashboard routes - inside DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="announcements" element={<Announcements />} />

          {/* Clients */}
          <Route path="clients" element={<ClientsList />} />
          <Route path="pcns" element={<PCNsList />} />
          <Route path="practices" element={<PracticesList />} />
          <Route path="pcn-profile/:id" element={<PCNProfile />} />
          <Route path="practice-profile/:id" element={<PracticeProfile />} />

          {/* Staff */}
          <Route path="staff-list" element={<StaffList />} />
          <Route path="staff-details/:id" element={<StaffDetails />} />
          <Route path="attendance" element={<AttendanceEmployee />} />

          {/* Rota */}
          <Route path="rota-management" element={<RotaManagement />} />

          {/* Leave */}
          <Route path="leave-list" element={<LeaveList />} />
          <Route path="leave-details/:id" element={<LeaveDetails />} />
          <Route path="leave-add" element={<AddLeaveRequest />} />
          <Route path="leave-edit/:id" element={<AddLeaveRequest isEditMode={true} />} />

          {/* Other */}
          <Route path="compliance" element={<ComplianceDashboard />} />
          <Route path="pcn-dashboard" element={<PCNDashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="timesheets" element={<UnderConstruction pageName="Timesheets" />} />

          {/* 404 fallback */}
          <Route path="*" element={<UnderConstruction pageName="Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
