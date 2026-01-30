import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const RotaManagement = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedView, setSelectedView] = useState('calendar');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample rota data
  const rotaData = {
    '2026-01-05': { staff: 'John Smith', shift: 'Morning', hours: 8 },
    '2026-01-07': { staff: 'Sarah Johnson', shift: 'Full Day', hours: 10 },
    '2026-01-10': { staff: 'Mike Williams', shift: 'Evening', hours: 6 },
    '2026-01-15': { staff: 'Emma Brown', shift: 'Full Day', hours: 10 },
  };

  const getDateKey = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Rota Management</h2>
          <p className="text-sm text-secondary">Manage staff schedules and shift assignments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
            <Plus size={18} />
            <span>Add Shift</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border text-primary rounded-xl hover:bg-primary transition-all duration-200 font-medium">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-primary rounded-xl border border-border p-1 inline-flex gap-1">
        <button
          onClick={() => setSelectedView('calendar')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            selectedView === 'calendar'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Calendar size={16} className="inline mr-2" />
          Calendar View
        </button>
        <button
          onClick={() => setSelectedView('list')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            selectedView === 'list'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Staff View
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Shifts</p>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Assigned</p>
              <p className="text-3xl font-bold text-emerald-600">18</p>
            </div>
            <Users className="text-emerald-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unassigned</p>
              <p className="text-3xl font-bold text-amber-600">6</p>
            </div>
            <Clock className="text-amber-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-purple-600">192</p>
            </div>
            <Clock className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-primary rounded-xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-secondary px-6 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <h3 className="text-lg font-bold text-primary">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-secondary py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {[...Array(startingDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {/* Actual days of the month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateKey = getDateKey(day);
              const hasShift = rotaData[dateKey];

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-xl p-3 hover:border-blue-500 transition-all duration-200 cursor-pointer ${
                    hasShift 
                      ? 'bg-blue-50 border-blue-200 border-2' 
                      : 'border-border bg-secondary hover:bg-primary'
                  }`}
                >
                  <div className={`text-sm font-semibold ${hasShift ? 'text-blue-600' : 'text-primary'}`}>
                    {day}
                  </div>
                  {hasShift && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-medium text-blue-700 truncate">
                        {hasShift.staff}
                      </div>
                      <div className="text-xs text-blue-600">
                        {hasShift.shift}
                      </div>
                      <div className="text-xs text-blue-500">
                        {hasShift.hours}h
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shift Legend */}
      <div className="bg-primary rounded-xl border border-border p-4">
        <h4 className="text-sm font-semibold text-primary mb-3">Shift Types</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-secondary">Morning Shift (6AM - 2PM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-secondary">Evening Shift (2PM - 10PM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-secondary">Full Day (8AM - 6PM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-secondary">Night Shift (10PM - 6AM)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotaManagement; 