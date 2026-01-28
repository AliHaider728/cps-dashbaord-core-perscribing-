import React from 'react';
import { Calendar, Users, GraduationCap, Briefcase, Clock } from 'lucide-react';

const UpcomingEvents = () => {
  const events = [
    {
      icon: GraduationCap,
      title: 'Fire Safety Training',
      date: 'Tomorrow',
      time: '09:00 AM',
      attendees: 24,
      type: 'training',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Users,
      title: 'Team Meeting',
      date: 'Feb 2',
      time: '02:00 PM',
      attendees: 12,
      type: 'meeting',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Briefcase,
      title: 'Interview - New Hire',
      date: 'Feb 3',
      time: '11:00 AM',
      attendees: 3,
      type: 'interview',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: GraduationCap,
      title: 'CPR Certification',
      date: 'Feb 5',
      time: '10:00 AM',
      attendees: 18,
      type: 'training',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      icon: Calendar,
      title: 'Monthly Review',
      date: 'Feb 7',
      time: '03:00 PM',
      attendees: 8,
      type: 'review',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    }
  ];

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">Upcoming Events</h3>
        <p className="text-sm text-secondary">Next 7 days</p>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl ${event.bgColor} border ${event.borderColor} hover:shadow-md transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${event.bgColor} border ${event.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <event.icon size={20} className={event.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${event.color} mb-1`}>
                  {event.title}
                </h4>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{event.date}</span>
                  </div>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{event.time}</span>
                  </div>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full py-3 bg-core-primary-600 hover:bg-core-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2">
          <Calendar size={16} />
          View Full Calendar
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;