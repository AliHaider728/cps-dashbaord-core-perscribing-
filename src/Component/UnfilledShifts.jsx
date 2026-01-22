import React from 'react';

const UnfilledShifts = () => {
  const shifts = [
    { name: 'Sunrise Care Home', time: 'Tomorrow 7:00 - 15:00', type: 'HCA needed', badge: 'AM' },
    { name: 'Oak Valley Practice', time: 'Today 14:00 - 22:00', type: 'RN needed', badge: 'PM' },
    { name: 'Meadow Health Centre', time: 'Wed 22:00 - 07:00', type: 'Support Worker', badge: 'NG' },
    { name: 'Riverside Nursing', time: 'Thu 08:00 - 16:00', type: 'HCA needed', badge: 'AM' },
    { name: 'Hillcrest Community', time: 'Fri 15:00 - 23:00', type: 'Senior Carer', badge: 'PM' }
  ];

  const badgeColors = {
    AM: 'bg-rose-500',
    PM: 'bg-orange-500',
    NG: 'bg-core-primary-600'
  };

  return (
    <div className="bg-secondary rounded-xl p-6 border ">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">Unfilled Shifts</h3>
        <p className="text-sm text-secondary">Urgent assignments needed</p>
        <a href="#" className="text-core-primary-500 hover:text-core-primary-400 text-sm font-medium mt-2 inline-block">
          View All →
        </a>
      </div>
      <div className="space-y-3">
        {shifts.map((shift, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 bg-primary rounded-lg border  hover:border-core-primary-500/50 transition-all">
            <div className={`px-3 py-2 ${badgeColors[shift.badge]} text-white text-xs font-bold rounded-lg`}>
              {shift.badge}
            </div>
            <div className="flex-1">
              <div className="text-primary font-medium text-sm">{shift.name}</div>
              <div className="text-secondary text-xs">{shift.time} • {shift.type}</div>
            </div>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg">
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnfilledShifts;