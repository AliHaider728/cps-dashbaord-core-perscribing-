import React from 'react';
import { CheckCircle, Calendar, FileText, AlertTriangle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { icon: CheckCircle, title: 'Leave approved', desc: 'Jane Smith approved Lisa T.\'s leave', time: '2 mins ago', color: 'text-green-500' },
    { icon: Calendar, title: 'Rota updated', desc: 'New rota published week 24 rota', time: '15 mins ago', color: 'text-core-primary-500' },
    { icon: FileText, title: 'Invoice sent', desc: 'INV-2024-0532 sent to Hillcrest', time: '1 hour ago', color: 'text-purple-500' },
    { icon: AlertTriangle, title: 'Compliance alert', desc: 'System flagged 3 expiring certs', time: '2 hours ago', color: 'text-yellow-500' }
  ];

  return (
    <div className="bg-secondary rounded-xl p-8 border ">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">Recent Activity</h3>
        <p className="text-sm text-secondary">System audit trail</p>
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1.5 bg-core-primary-500 text-white rounded-lg text-xs font-medium">Today</button>
          <button className="px-3 py-1.5 bg-primary text-secondary rounded-lg text-xs font-medium hover:bg-core-primary-500/10">This Week</button>
          <button className="px-3 py-1.5 bg-primary text-secondary rounded-lg text-xs font-medium hover:bg-core-primary-500/10">All</button>
        </div>
      </div>
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-primary border  flex items-center justify-center ${activity.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-primary font-medium text-sm">{activity.title}</div>
                <div className="text-secondary text-xs">{activity.desc}</div>
              </div>
              <div className="text-secondary text-xs whitespace-nowrap">{activity.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;