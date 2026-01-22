import React from 'react';

const KPICard = ({ icon: Icon, value, title, subtitle, status, badge, trend }) => {
  const statusColors = {
    success: 'from-green-500 to-emerald-600',
    urgent: 'from-orange-500 to-red-600',
    review: 'from-core-primary-400 to-core-primary-600',
    alert: 'from-red-500 to-rose-600',
    invoice: 'from-core-primary-500 to-core-primary-700',
    target: 'from-core-primary-300 to-core-primary-500'
  };

  const badgeColors = {
    success: 'bg-green-500',
    urgent: 'bg-orange-500',
    review: 'bg-core-primary-500',
    alert: 'bg-red-500',
    invoice: 'bg-core-primary-600',
    target: 'bg-core-primary-400'
  };

  return (
    <div className="bg-secondary rounded-xl p-6 border  hover:border-core-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-core-primary-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${statusColors[status]} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={24} />
        </div>
        {badge && (
          <span className={`px-3 py-1 ${badgeColors[status]} text-white text-xs font-semibold rounded-full`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm font-medium text-primary mb-1">{title}</div>
      <div className="text-xs text-secondary">{subtitle}</div>
      {trend && (
        <div className={`mt-3 text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

export default KPICard;