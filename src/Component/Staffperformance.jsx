import React from 'react';
import { Award, Star, TrendingUp, Clock } from 'lucide-react';

const StaffPerformance = () => {
  const topPerformers = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Nurse',
      avatar: 'SJ',
      rating: 4.9,
      hoursWorked: 168,
      shiftsCompleted: 21,
      onTimePercentage: 100,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      name: 'Michael Chen',
      role: 'Healthcare Assistant',
      avatar: 'MC',
      rating: 4.8,
      hoursWorked: 160,
      shiftsCompleted: 20,
      onTimePercentage: 98,
      color: 'from-gray-300 to-gray-400'
    },
    {
      name: 'Emily Williams',
      role: 'Care Coordinator',
      avatar: 'EW',
      rating: 4.7,
      hoursWorked: 152,
      shiftsCompleted: 19,
      onTimePercentage: 97,
      color: 'from-orange-400 to-orange-500'
    },
    {
      name: 'David Brown',
      role: 'Support Worker',
      avatar: 'DB',
      rating: 4.6,
      hoursWorked: 145,
      shiftsCompleted: 18,
      onTimePercentage: 95,
      color: 'from-blue-400 to-blue-500'
    }
  ];

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-primary">Top Performers</h3>
          <p className="text-sm text-secondary">This month's outstanding staff</p>
        </div>
        <button className="text-core-primary-500 hover:text-core-primary-400 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {topPerformers.map((staff, idx) => (
          <div
            key={idx}
            className="relative p-5 bg-primary rounded-xl border border-border hover:border-core-primary-500/50 transition-all duration-300 hover:shadow-lg"
          >
            {/* Rank Badge */}
            {idx < 3 && (
              <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br ${staff.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                #{idx + 1}
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-core-primary-500 to-core-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                {staff.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-primary">{staff.name}</h4>
                    <p className="text-sm text-secondary">{staff.role}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm text-yellow-600 dark:text-yellow-400">
                      {staff.rating}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-blue-500" />
                      <span className="text-xs text-secondary">Hours</span>
                    </div>
                    <div className="font-bold text-primary">{staff.hoursWorked}</div>
                  </div>

                  <div className="bg-secondary rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={14} className="text-green-500" />
                      <span className="text-xs text-secondary">Shifts</span>
                    </div>
                    <div className="font-bold text-primary">{staff.shiftsCompleted}</div>
                  </div>

                  <div className="bg-secondary rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-purple-500" />
                      <span className="text-xs text-secondary">On Time</span>
                    </div>
                    <div className="font-bold text-primary">{staff.onTimePercentage}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">156</div>
          <div className="text-xs text-secondary">Active Staff</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">4.7</div>
          <div className="text-xs text-secondary">Avg Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">97%</div>
          <div className="text-xs text-secondary">Satisfaction</div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;