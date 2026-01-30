import React, { useState } from 'react';
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

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'clients':
        return <ClientsList 
          onSelectPCN={(pcn) => {
            setSelectedClient(pcn);
            setActivePage('pcn-profile');
          }}
          onSelectPractice={(practice) => {
            setSelectedClient(practice);
            setActivePage('practice-profile');
          }}
        />;
      
      case 'pcns':
        return <PCNsList 
          onSelectPCN={(pcn) => {
            setSelectedClient(pcn);
            setActivePage('pcn-profile');
          }}
        />;
      
      case 'practices':
        return <PracticesList 
          onSelectPractice={(practice) => {
            setSelectedClient(practice);
            setActivePage('practice-profile');
          }}
        />;
      
      case 'pcn-profile':
        return <PCNProfile 
          pcnData={selectedClient}
          onBack={() => setActivePage('clients')}
          onSelectPractice={(practice) => {
            setSelectedClient(practice);
            setActivePage('practice-profile');
          }}
          setActivePage={setActivePage}
        />;
      
      case 'practice-profile':
        return <PracticeProfile 
          practiceData={selectedClient}
          onBack={() => setActivePage('clients')}
          setActivePage={setActivePage}
        />;
      
      case 'staff-list':
        return <StaffList 
          onSelectStaff={(staff) => {
            setSelectedStaff(staff);
            setActivePage('staff-details');
          }}
          onAddStaff={() => {
            console.log('Add new staff');
          }}
        />;
      
      case 'staff-details':
        return <StaffDetails 
          staffData={selectedStaff}
          onBack={() => setActivePage('staff-list')}
        />;
      
      case 'rota-management':
        return <RotaManagement />;
      
      // Leave Management Routes
      case 'leave-list':
        return <LeaveList 
          onViewDetails={(leave) => {
            setSelectedLeave(leave);
            setActivePage('leave-details');
          }}
          onAddNew={() => setActivePage('leave-add')}
          onEdit={(leave) => {
            setSelectedLeave(leave);
            setActivePage('leave-edit');
          }}
        />;
      
      case 'leave-details':
        return <LeaveDetails 
          leaveData={selectedLeave}
          onBack={() => setActivePage('leave-list')}
          onApprove={(id) => {
            alert('Leave approved successfully!');
            setActivePage('leave-list');
          }}
          onReject={(id) => {
            alert('Leave rejected!');
            setActivePage('leave-list');
          }}
        />;
      
      case 'leave-add':
        return <AddLeaveRequest 
          onBack={() => setActivePage('leave-list')}
          onSave={(data) => {
            alert('Leave request submitted successfully!');
            setActivePage('leave-list');
          }}
        />;
      
      case 'leave-edit':
        return <AddLeaveRequest 
          leaveData={selectedLeave}
          isEditMode={true}
          onBack={() => setActivePage('leave-list')}
          onSave={(data) => {
            alert('Leave request updated successfully!');
            setActivePage('leave-list');
          }}
        />;
      
      case 'compliance':
        return <ComplianceDashboard />;
      
      // PCN Dashboard Route
      case 'pcn-dashboard':
        return <PCNDashboard />;
      
      // Invoices Route
      case 'invoices':
        return <Invoices />;
      
      default:
        return (
          <div className="bg-secondary rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}
            </h2>
            <p className="text-secondary">This page is under construction</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default App;