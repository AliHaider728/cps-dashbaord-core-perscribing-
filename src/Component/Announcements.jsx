import React from 'react';
import { Megaphone, AlertCircle, Info, CheckCircle } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      icon: Megaphone,
      title: 'System Maintenance',
      message: 'Scheduled for Sunday 2 AM',
      time: '2 hours ago',
      type: 'info',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: AlertCircle,
      title: 'Policy Update',
      message: 'New leave policy effective Feb 1',
      time: '5 hours ago',
      type: 'warning',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      icon: CheckCircle,
      title: 'Training Complete',
      message: '45 staff completed fire safety',
      time: '1 day ago',
      type: 'success',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">Announcements</h3>
        <p className="text-sm text-secondary">Latest updates</p>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl ${announcement.bgColor} border ${announcement.borderColor} hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${announcement.bgColor} border ${announcement.borderColor} flex items-center justify-center flex-shrink-0`}>
                <announcement.icon size={20} className={announcement.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold text-sm ${announcement.color}`}>
                    {announcement.title}
                  </h4>
                  <span className="text-xs text-secondary">{announcement.time}</span>
                </div>
                <p className="text-sm text-secondary">{announcement.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm font-medium text-core-primary-500 hover:text-core-primary-400 transition-colors">
        View All Announcements →
      </button>
    </div>
  );
};

export default Announcements;