import React from 'react';
import { AlertCircle } from 'lucide-react';

const ComplianceList = () => {
  const alerts = [
    { name: 'Sarah Johnson - DBS expired', time: 'Expired 3 days ago', status: 'critical' },
    { name: 'Michael Brown - Manual Handling', time: 'Expired yesterday', status: 'critical' },
    { name: 'Emily Davis - First Aid', time: 'Expires in 5 days', status: 'warning' },
    { name: 'James Wilson - Right to Work', time: 'Expires in 6 days', status: 'warning' }
  ];

  return (
    <div className="bg-secondary rounded-xl p-6  border  ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-primary">Compliance Alerts</h3>
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">12</span>
        </div>
        <a href="#" className="text-core-primary-500 hover:text-core-primary-400 text-sm font-medium">
          Manage All →
        </a>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-primary rounded-lg border   hover:border-core-primary-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${alert.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <div>
                <div className="text-primary font-medium text-sm">{alert.name}</div>
                <div className="text-secondary text-xs">{alert.time}</div>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              alert.status === 'critical' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}>
              {alert.status === 'critical' ? 'Action' : 'Remind'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceList;