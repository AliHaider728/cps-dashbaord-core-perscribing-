import React from 'react';
import { UserPlus, Calendar, FileText, Mail, DollarSign, Clock, Users, Settings } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { 
      icon: UserPlus, 
      label: 'Add Staff', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    { 
      icon: Calendar, 
      label: 'Create Rota', 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    { 
      icon: Clock, 
      label: 'Log Hours', 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    },
    { 
      icon: FileText, 
      label: 'View Reports', 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500'
    },
    { 
      icon: DollarSign, 
      label: 'Process Invoice', 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    { 
      icon: Mail, 
      label: 'Send Message', 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      iconColor: 'text-pink-500'
    },
    { 
      icon: Users, 
      label: 'Team View', 
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-500/10',
      iconColor: 'text-slate-500'
    }
  ];

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">Quick Actions</h3>
        <p className="text-sm text-secondary">Frequently used actions</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`group relative p-4 rounded-xl ${action.bgColor} border border-transparent hover:border-current transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                <action.icon size={24} />
              </div>
              <span className={`text-sm font-medium ${action.iconColor} group-hover:font-semibold transition-all`}>
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;