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

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard />;
      
      // Main Clients page - shows both PCNs and Standalone practices with type selector
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
      
      // PCNs only page
      case 'pcns':
        return <PCNsList 
          onSelectPCN={(pcn) => {
            setSelectedClient(pcn);
            setActivePage('pcn-profile');
          }}
        />;
      
      // All Practices page (both PCN practices and standalone)
      case 'practices':
        return <PracticesList 
          onSelectPractice={(practice) => {
            setSelectedClient(practice);
            setActivePage('practice-profile');
          }}
        />;
      
      // PCN Profile with 5 tabs
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
      
      // Practice Profile with 5 tabs
      case 'practice-profile':
        return <PracticeProfile 
          practiceData={selectedClient}
          onBack={() => setActivePage('clients')}
          setActivePage={setActivePage}
        />;
      
      // Staff List
      case 'staff-list':
        return <StaffList 
          onSelectStaff={(staff) => {
            setSelectedStaff(staff);
            setActivePage('staff-details');
          }}
          onAddStaff={() => {
            // Add new staff logic
            console.log('Add new staff');
          }}
        />;
      
      // Staff Details
      case 'staff-details':
        return <StaffDetails 
          staffData={selectedStaff}
          onBack={() => setActivePage('staff-list')}
        />;
      
      // Placeholder pages for other menu items
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