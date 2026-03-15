import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './Component/DashboardLayout.jsx';

import Dashboard           from "./Component/Dashboard/Dashboard.jsx";
import ClientsList         from './Component/Pages/ClientsList.jsx';
import PCNsList            from './Component/Pages/PCNsList.jsx';
import PracticesList       from './Component/Pages/PracticesList.jsx';
import PCNProfile          from './Component/Pages/PCNProfile.jsx';
import PracticeProfile     from './Component/Pages/Practiceprofile.jsx';
import StaffList           from './Component/Pages/Staff/Stafflist.jsx';
import StaffDetails        from './Component/Pages/Staff/StaffDetails.jsx';
import RotaManagement      from './Component/Pages/RotaManagement/RotaMaegment.jsx';
import LeaveList           from './Component/Pages/Leave/LeaveList.jsx';
import LeaveDetails        from './Component/Pages/Leave/LeaveDetails.jsx';
import AddLeaveRequest     from './Component/Pages/Leave/AddLeaveRequest.jsx';
import ComplianceDashboard from './Component/ComplianceDashboard.jsx';
import PCNDashboard        from './Component/Dashboard/PCNDashboard.jsx';
import Invoices            from './Component/Pages/Invoices.jsx';
import Announcements       from './Component/Pages/Announcements.jsx';
import AttendanceEmployee  from './Component/Pages/Staff/AttendanceEmployee.jsx';

import EmailDashboard     from './Component/Pages/email-activity/Dashboard.jsx';
import EmailClients       from './Component/Pages/email-activity/Clients.jsx';
import EmailClientDetail  from './Component/Pages/email-activity/ClientDetail.jsx';
import EmailList          from './Component/Pages/email-activity/Emails.jsx';
import EmailTeam          from './Component/Pages/email-activity/Team.jsx';
import EmailNotifications from './Component/Pages/email-activity/Notifications.jsx';

import AuthContextProvider from './context/AuthContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000, gcTime: 5 * 60_000 },
    mutations: { retry: 0 },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage]       = useState('dashboard');
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    const pathname = location.pathname.replace('/', '');
    setActivePage(pathname || 'dashboard');
  }, [location.pathname]);

  const handleViewLeaveDetails = (leave) => { setSelectedLeave(leave); navigate(`/leave-details/${leave.id}`); };
  const handleAddLeave         = ()       => { setSelectedLeave(null);  navigate('/leave-add'); };
  const handleEditLeave        = (leave) => { setSelectedLeave(leave); navigate(`/leave-edit/${leave.id}`); };
  const handleApproveLeave     = ()       => { alert('Leave approved successfully!'); navigate('/leave-list'); };
  const handleRejectLeave      = ()       => { alert('Leave rejected!');              navigate('/leave-list'); };
  const handleSaveLeave        = ()       => { alert('Leave request saved successfully!'); navigate('/leave-list'); };
  const handleBackFromLeave    = ()       => navigate('/leave-list');

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      <Routes>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/clients"              element={<ClientsList />} />
        <Route path="/pcns"                 element={<PCNsList />} />
        <Route path="/practices"            element={<PracticesList />} />
        <Route path="/pcn-profile/:id"      element={<PCNProfile />} />
        <Route path="/practice-profile/:id" element={<PracticeProfile />} />

        <Route path="/staff-list"        element={<StaffList />} />
        <Route path="/staff-details/:id" element={<StaffDetails />} />
        <Route path="/attendance"        element={<AttendanceEmployee />} />

        <Route path="/rota-management" element={<RotaManagement />} />

        <Route path="/leave-list"
          element={<LeaveList onViewDetails={handleViewLeaveDetails} onAddNew={handleAddLeave} onEdit={handleEditLeave} />}
        />
        <Route path="/leave-details/:id"
          element={<LeaveDetails leaveData={selectedLeave} onBack={handleBackFromLeave} onApprove={handleApproveLeave} onReject={handleRejectLeave} />}
        />
        <Route path="/leave-add"
          element={<AddLeaveRequest leaveData={null} isEditMode={false} onBack={handleBackFromLeave} onSave={handleSaveLeave} />}
        />
        <Route path="/leave-edit/:id"
          element={<AddLeaveRequest leaveData={selectedLeave} isEditMode={true} onBack={handleBackFromLeave} onSave={handleSaveLeave} />}
        />

        <Route path="/compliance"    element={<ComplianceDashboard />} />
        <Route path="/pcn-dashboard" element={<PCNDashboard />} />
        <Route path="/invoices"      element={<Invoices />} />

        <Route path="/email-activity"              element={<EmailDashboard />} />
        <Route path="/email-activity/clients"      element={<EmailClients />} />
        <Route path="/email-activity/clients/:id"  element={<EmailClientDetail />} />
        <Route path="/email-activity/emails"       element={<EmailList />} />
        <Route path="/email-activity/team"         element={<EmailTeam />} />
        <Route path="/email-activity/notifications" element={<EmailNotifications />} />

        <Route path="*" element={
          <div className="bg-secondary rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Page Not Found</h2>
            <p className="text-secondary">This page does not exist</p>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthContextProvider>
          <AppRoutes />
        </AuthContextProvider>
      </Router>
    </QueryClientProvider>
  );
}