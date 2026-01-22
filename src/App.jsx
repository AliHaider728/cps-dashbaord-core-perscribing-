import React, { useState } from 'react';
import DashboardLayout from './Component/DashboardLayout';
import Dashboard from './Component/Dashboard/Dashboard';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' ? (
        <Dashboard />
      ) : (
        <div className="bg-secondary rounded-xl p-12 border border-core-border text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h2>
          <p className="text-secondary">This page is under construction</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default App;