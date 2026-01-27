import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';

const RotaTab = ({ staffData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedProject, setSelectedProject] = useState('All Projects');

  const projects = ['All Projects', 'Director', 'Annual Leave', 'PCN Coverage', 'Emergency Shifts'];

  const leaveTypes = [
    { name: 'Annual (non-PCN)', color: 'bg-pink-500', textColor: 'text-pink-700' },
    { name: 'Approved- No Cover needed', color: 'bg-blue-500', textColor: 'text-blue-700' },
    { name: 'Approved- Cover needed', color: 'bg-red-500', textColor: 'text-red-700' },
    { name: 'Pending leave', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { name: 'Cover found', color: 'bg-green-500', textColor: 'text-green-700' },
    { name: 'Booked', color: 'bg-orange-500', textColor: 'text-orange-700' },
    { name: 'Providing cover', color: 'bg-purple-500', textColor: 'text-purple-700' }
  ];

  // Sample rota data - randomly distributed
  const rotaData = {
    '2026-01-07': { type: 'Annual', color: 'bg-pink-100', border: 'border-pink-500' },
    '2026-01-08': { type: 'Annual', color: 'bg-pink-100', border: 'border-pink-500' },
    '2026-01-14': { type: 'Cover', color: 'bg-purple-100', border: 'border-purple-500' },
    '2026-01-15': { type: 'Approved', color: 'bg-blue-100', border: 'border-blue-500' },
    '2026-01-21': { type: 'Booked', color: 'bg-orange-100', border: 'border-orange-500' },
    '2026-01-22': { type: 'Booked', color: 'bg-orange-100', border: 'border-orange-500' },
    '2026-01-28': { type: 'Pending', color: 'bg-yellow-100', border: 'border-yellow-500' }
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

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDateKey = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Rota Calendar</h2>
          <p className="text-secondary text-sm mt-1">View and manage staff scheduling</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200">
          <Download size={16} />
          <span className="font-medium">Export</span>
        </button>
      </div>

      {/* Leave Type Legend */}
      <div className="bg-primary rounded-xl border border-border p-4">
        <div className="flex flex-wrap gap-3">
          {leaveTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${type.color} rounded`}></div>
              <span className="text-sm text-secondary">{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Project Selection */}
        <div className="lg:col-span-1">
          <div className="bg-primary rounded-xl border border-border p-4 space-y-4">
            <h3 className="font-semibold text-primary">Project</h3>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            >
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            
            <div className="pt-4 border-t border-border space-y-2">
              <div className="text-sm text-secondary">Current Selection:</div>
              <div className="font-medium text-primary">{selectedProject}</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-primary rounded-xl border border-border overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-core-primary-50 px-6 py-4 flex items-center justify-between border-b border-border">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-core-primary-100 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft size={20} className="text-primary" />
              </button>
              <h3 className="text-lg font-bold text-primary">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-core-primary-100 rounded-lg transition-colors duration-200"
              >
                <ChevronRight size={20} className="text-primary" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
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
                {[...Array(startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {/* Actual days of the month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateKey = getDateKey(day);
                  const hasEvent = rotaData[dateKey];

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 hover:border-core-primary-500 transition-all duration-200 cursor-pointer ${
                        hasEvent 
                          ? `${hasEvent.color} ${hasEvent.border} border-2` 
                          : 'border-border bg-secondary'
                      }`}
                    >
                      <div className={`text-sm font-medium ${hasEvent ? hasEvent.border.replace('border-', 'text-') : 'text-primary'}`}>
                        {day}
                      </div>
                      {hasEvent && (
                        <div className="mt-1">
                          <div className="text-xs font-medium truncate">
                            {hasEvent.type}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-core-primary-500">7</div>
          <div className="text-sm text-secondary mt-1">Scheduled Days</div>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-green-600">5</div>
          <div className="text-sm text-secondary mt-1">Approved Leaves</div>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-secondary mt-1">Pending</div>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-purple-600">1</div>
          <div className="text-sm text-secondary mt-1">Cover Shifts</div>
        </div>
      </div>
    </div>
  );
};

export default RotaTab;