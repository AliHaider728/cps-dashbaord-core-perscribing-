import React, { useState } from 'react';
import { Search, Plus, Download, Trash2, Edit, Eye, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Users, Bell, Send, BarChart3, TrendingUp, TrendingDown, Award, FileText } from 'lucide-react';

const LeaveList = ({ onViewDetails, onAddNew, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMonthlyView, setShowMonthlyView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // STAFF DATA WITH FULL TRACKING
const leaveData = [
  {
    id: 201,
    requester: { 
      name: 'Aisha Rahman', 
      avatar: 'AR', 
      role: 'Clinical Pharmacist',
      email: 'aisha.rahman@coreprescribing.com',
      department: 'Clinical Services',
      leaveBalance: 92.00,
      contractHours: 2080,
      workingDays: 260,
      leavesBookedThisMonth: 0,
      totalLeavesBooked: 12,
      complianceStatus: 'compliant',
      trainingsDue: 0,
      documentsDue: 0
    },
    fromDate: '2026-04-10',
    toDate: '2026-04-12',
    hours: 22.5,
    leaveType: 'Annual Leave',
    additionalInfo: 'Family visit to relatives',
    status: 'pending',
    approvers: ['Sarah Johnson'],
    appliedDate: '2026-03-20',
    employee: 'Aisha Rahman',
    projectName: 'Central London Clinic',
    startTime: '08:30',
    endTime: '17:00',
    approver: 'Sarah Johnson',
    reason: '',
    coverRequired: true,
    coverAssigned: false,
    assignedCoverStaff: null,
    workingDays: 3,
    requestNotes: 'Need cover for routine prescriptions. All urgent tasks completed.',
    lineManager: 'Sarah Johnson',
    department: 'Clinical Services',
    submittedOn: '2026-03-20 11:45',
    lastUpdated: '2026-03-20 11:45',
    monthBooked: 3 // April
  },
  {
    id: 202,
    requester: { 
      name: 'Omar Farooq', 
      avatar: 'OF', 
      role: 'Practice Manager',
      email: 'omar.farooq@coreprescribing.com',
      department: 'Management',
      leaveBalance: 168.00,
      contractHours: 2080,
      workingDays: 260,
      leavesBookedThisMonth: 0,
      totalLeavesBooked: 28,
      complianceStatus: 'compliant',
      trainingsDue: 1,
      documentsDue: 0
    },
    fromDate: '2026-05-18',
    toDate: '2026-05-20',
    hours: 22.5,
    leaveType: 'Annual Leave (PCN)',
    additionalInfo: 'Short break and rest',
    status: 'approved',
    approvers: ['Emma Wilson'],
    appliedDate: '2026-04-05',
    employee: 'Omar Farooq',
    projectName: 'South East Practices',
    startTime: '09:00',
    endTime: '17:00',
    approver: 'Emma Wilson',
    reason: 'Approved - cover arranged internally',
    coverRequired: true,
    coverAssigned: true,
    assignedCoverStaff: {
      name: 'Liam Patel',
      role: 'Deputy Manager',
      avatar: 'LP'
    },
    workingDays: 3,
    requestNotes: 'All reports and meetings delegated.',
    lineManager: 'Emma Wilson',
    department: 'Management',
    submittedOn: '2026-04-05 09:15',
    lastUpdated: '2026-04-06 14:30',
    approvedDate: '2026-04-06 14:30',
    approvedBy: 'Emma Wilson',
    monthBooked: 4 // May
  },
  {
    id: 203,
    requester: { 
      name: 'Zara Hussain', 
      avatar: 'ZH', 
      role: 'Senior Pharmacist',
      email: 'zara.hussain@coreprescribing.com',
      department: 'Clinical Services',
      leaveBalance: 135.00,
      contractHours: 2080,
      workingDays: 260,
      leavesBookedThisMonth: 7.5,
      totalLeavesBooked: 38,
      complianceStatus: 'non-compliant',
      trainingsDue: 2,
      documentsDue: 1
    },
    fromDate: '2026-03-15',
    toDate: '2026-03-15',
    hours: 7.5,
    leaveType: 'Sick Leave',
    additionalInfo: 'Severe headache and fatigue',
    status: 'approved',
    approvers: ['Michael Brown'],
    appliedDate: '2026-03-14',
    employee: 'Zara Hussain',
    projectName: 'North London Practice Group',
    startTime: '08:30',
    endTime: '17:00',
    approver: 'Michael Brown',
    reason: 'Approved - self-certified sick day',
    coverRequired: false,
    coverAssigned: false,
    assignedCoverStaff: null,
    workingDays: 1,
    requestNotes: 'Unable to attend due to illness. Will resume tomorrow.',
    lineManager: 'Michael Brown',
    department: 'Clinical Services',
    submittedOn: '2026-03-14 08:40',
    lastUpdated: '2026-03-14 10:10',
    approvedDate: '2026-03-14 10:10',
    approvedBy: 'Michael Brown',
    monthBooked: 2 // March
  }
];
  // AVAILABLE STAFF FOR AUTO-COVER
  const availableStaffForCover = [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Clinical Pharmacist', availability: 'Full Day Available', avatar: 'SJ', workingDays: [1,2,3,4,5] },
    { id: 2, name: 'Mike Williams', role: 'Senior Pharmacist', availability: 'Morning Shift Available', avatar: 'MW', workingDays: [1,2,3,4,5] },
    { id: 3, name: 'Emma Brown', role: 'Pharmacy Manager', availability: 'Full Day Available', avatar: 'EB', workingDays: [1,2,3,4,5] },
    { id: 4, name: 'James Wilson', role: 'Clinical Lead', availability: 'Afternoon Available', avatar: 'JW', workingDays: [1,2,3,4,5] },
    { id: 5, name: 'Lisa Anderson', role: 'Practice Pharmacist', availability: 'Full Day Available', avatar: 'LA', workingDays: [1,2,3,4,5] }
  ];

  // CALCULATE KPIs
  const calculateKPIs = () => {
    const totalWorkingDays = leaveData.reduce((sum, leave) => sum + leave.requester.workingDays, 0) / leaveData.length;
    const totalClinicians = new Set(leaveData.map(l => l.requester.email)).size;
    const totalLeavesTaken = leaveData.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.hours, 0);
    const totalPendingLeaves = leaveData.filter(l => l.status === 'pending').length;
    const averageLeaveBalance = leaveData.reduce((sum, l) => sum + l.requester.leaveBalance, 0) / leaveData.length;
    const lowBalanceStaff = leaveData.filter(l => l.requester.leaveBalance < 50).length;
    const nonCompliantStaff = leaveData.filter(l => l.requester.complianceStatus === 'non-compliant').length;
    
    return {
      totalWorkingDays: Math.round(totalWorkingDays),
      totalClinicians,
      totalLeavesTaken: Math.round(totalLeavesTaken),
      totalPendingLeaves,
      averageLeaveBalance: Math.round(averageLeaveBalance),
      lowBalanceStaff,
      nonCompliantStaff,
      leaveUtilizationRate: Math.round((totalLeavesTaken / (totalClinicians * 2080)) * 100)
    };
  };

  const kpis = calculateKPIs();

  // AUTO-GENERATED NOTIFICATIONS
  const generateNotifications = () => {
    const notifications = [];
    
    // Low balance warnings
    leaveData.forEach(leave => {
      if (leave.requester.leaveBalance < 50) {
        notifications.push({
          type: 'warning',
          priority: 'high',
          staff: leave.requester.name,
          email: leave.requester.email,
          message: `Low leave balance: ${leave.requester.leaveBalance} hours remaining. Please book your remaining leaves.`,
          action: 'Send Reminder',
          category: 'leave-balance'
        });
      }
    });

    // Monthly booking reminders
    leaveData.forEach(leave => {
      if (leave.requester.leavesBookedThisMonth === 0) {
        notifications.push({
          type: 'info',
          priority: 'medium',
          staff: leave.requester.name,
          email: leave.requester.email,
          message: `No leaves booked this month. Balance: ${leave.requester.leaveBalance} hours. Consider booking your leaves.`,
          action: 'Send Reminder',
          category: 'monthly-booking'
        });
      }
    });

    // Cover required notifications
    leaveData.forEach(leave => {
      if (leave.status === 'pending' && leave.coverRequired && !leave.coverAssigned) {
        notifications.push({
          type: 'urgent',
          priority: 'high',
          staff: leave.requester.name,
          email: leave.requester.email,
          message: `Cover required for leave from ${leave.fromDate} to ${leave.toDate}. Auto-assigning available staff.`,
          action: 'Auto-Assign Cover',
          category: 'cover-required',
          leaveId: leave.id
        });
      }
    });

    // Compliance notifications
    leaveData.forEach(leave => {
      if (leave.requester.complianceStatus === 'non-compliant') {
        notifications.push({
          type: 'warning',
          priority: 'high',
          staff: leave.requester.name,
          email: leave.requester.email,
          message: `Non-compliant: ${leave.requester.trainingsDue} trainings due, ${leave.requester.documentsDue} documents pending.`,
          action: 'View Compliance',
          category: 'compliance'
        });
      }
    });

    return notifications;
  };

  const notifications = generateNotifications();

  // AUTO-ASSIGN COVER FUNCTION
  const autoAssignCover = (leaveId) => {
    const leave = leaveData.find(l => l.id === leaveId);
    if (!leave) return;

    // Find available staff (simple logic - can be enhanced)
    const availableStaff = availableStaffForCover[Math.floor(Math.random() * availableStaffForCover.length)];
    
    alert(`Auto-Assigned Cover: ${availableStaff.name} (${availableStaff.role}) has been notified to cover for ${leave.requester.name} from ${leave.fromDate} to ${leave.toDate}.`);
  };

  // SEND NOTIFICATION FUNCTION
  const sendNotification = (notification) => {
    if (notification.category === 'cover-required') {
      autoAssignCover(notification.leaveId);
    } else {
      alert(`Email sent to ${notification.staff} (${notification.email}):
      
${notification.message}

Type: ${notification.type.toUpperCase()}
Priority: ${notification.priority.toUpperCase()}`);
    }
  };

  // MONTHLY LEAVE TRACKING
  const getMonthlyLeaveData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const monthLeaves = leaveData.filter(l => l.monthBooked === index && l.status === 'approved');
      const totalHours = monthLeaves.reduce((sum, l) => sum + l.hours, 0);
      const totalStaff = new Set(monthLeaves.map(l => l.requester.email)).size;
      
      return {
        month,
        hours: totalHours,
        staff: totalStaff,
        leaves: monthLeaves.length
      };
    });
    
    return monthlyData;
  };

  const monthlyData = getMonthlyLeaveData();

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', icon: AlertCircle, bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', dotColor: 'bg-amber-500' },
      approved: { label: 'Approved', icon: CheckCircle, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', dotColor: 'bg-emerald-500' },
      rejected: { label: 'Rejected', icon: XCircle, bgColor: 'bg-rose-50', textColor: 'text-rose-700', borderColor: 'border-rose-200', dotColor: 'bg-rose-500' }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredLeaves = leaveData.filter(leave => {
    const matchesSearch = leave.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.requester.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leaveData.length,
    pending: leaveData.filter(l => l.status === 'pending').length,
    approved: leaveData.filter(l => l.status === 'approved').length,
    rejected: leaveData.filter(l => l.status === 'rejected').length,
    totalHours: leaveData.reduce((sum, l) => sum + l.hours, 0),
    needsCover: leaveData.filter(l => l.coverRequired && !l.coverAssigned).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Leave Management Dashboard</h2>
          <p className="text-sm text-secondary">Complete leave tracking with KPIs, auto-notifications & compliance</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* NOTIFICATION BELL */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border text-primary rounded-xl hover:bg-primary transition-all duration-200 font-medium"
          >
            <Bell size={18} />
            <span className="hidden sm:inline">Notifications</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {/* MONTHLY VIEW TOGGLE */}
          <button 
            onClick={() => setShowMonthlyView(!showMonthlyView)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <BarChart3 size={18} />
            <span className="hidden sm:inline">Monthly View</span>
          </button>

          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus size={18} />
            <span>New Leave Request</span>
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-blue-600" size={24} />
          <h3 className="text-lg font-bold text-gray-800">Leave KPIs & Analytics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-xs text-gray-500 mb-1">Total Clinicians</p>
            <p className="text-2xl font-bold text-blue-600">{kpis.totalClinicians}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-xs text-gray-500 mb-1">Working Days</p>
            <p className="text-2xl font-bold text-blue-600">{kpis.totalWorkingDays}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <p className="text-xs text-gray-500 mb-1">Leaves Taken</p>
            <p className="text-2xl font-bold text-green-600">{kpis.totalLeavesTaken}h</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{kpis.totalPendingLeaves}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Avg Balance</p>
            <p className="text-2xl font-bold text-purple-600">{kpis.averageLeaveBalance}h</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <p className="text-xs text-gray-500 mb-1">Low Balance</p>
            <p className="text-2xl font-bold text-red-600">{kpis.lowBalanceStaff}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <p className="text-xs text-gray-500 mb-1">Non-Compliant</p>
            <p className="text-2xl font-bold text-orange-600">{kpis.nonCompliantStaff}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-xs text-gray-500 mb-1">Utilization</p>
            <p className="text-2xl font-bold text-indigo-600">{kpis.leaveUtilizationRate}%</p>
          </div>
        </div>
      </div>

      {/* MONTHLY VIEW */}
      {showMonthlyView && (
        <div className="bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-purple-50 to-indigo-50">
            <h3 className="text-lg font-bold text-primary">Monthly Leave Breakdown (2026)</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {monthlyData.map((data, idx) => (
                <div key={idx} className={`bg-white rounded-lg p-4 border-2 ${data.hours > 0 ? 'border-blue-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{data.month}</span>
                    {data.hours > 0 ? (
                      <TrendingUp className="text-green-500" size={16} />
                    ) : (
                      <TrendingDown className="text-gray-300" size={16} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Hours: <span className="font-bold text-blue-600">{data.hours}</span></p>
                    <p className="text-xs text-gray-500">Staff: <span className="font-bold text-purple-600">{data.staff}</span></p>
                    <p className="text-xs text-gray-500">Leaves: <span className="font-bold text-green-600">{data.leaves}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUTO-NOTIFICATIONS PANEL */}
      {showNotifications && notifications.length > 0 && (
        <div className="bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Auto-Generated Notifications ({notifications.length})</h3>
              <button
                onClick={() => {
                  notifications.forEach(notif => sendNotification(notif));
                  alert(`${notifications.length} notifications sent successfully!`);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Send All Notifications
              </button>
            </div>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {notifications.map((notif, idx) => (
              <div key={idx} className={`p-4 hover:bg-primary transition-colors ${
                notif.priority === 'high' ? 'bg-red-50/50' : ''
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        notif.type === 'urgent' ? 'bg-red-100 text-red-700' :
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notif.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{notif.category}</span>
                    </div>
                    <div className="font-semibold text-primary mb-1">{notif.staff}</div>
                    <div className="text-sm text-secondary mb-2">{notif.message}</div>
                    <div className="text-xs text-gray-400">{notif.email}</div>
                  </div>
                  <button
                    onClick={() => sendNotification(notif)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm whitespace-nowrap font-medium shadow-md"
                  >
                    <Send size={14} className="inline mr-2" />
                    {notif.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <Clock className="text-amber-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <CheckCircle className="text-emerald-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-rose-600">{stats.rejected}</p>
            </div>
            <XCircle className="text-rose-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalHours}</p>
            </div>
            <BarChart3 className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Needs Cover</p>
              <p className="text-3xl font-bold text-orange-600">{stats.needsCover}</p>
            </div>
            <Users className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-primary rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-primary rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-border">
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Requester</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Leave Period</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Duration</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Balance</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Compliance</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Leave Type</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Cover Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeaves.map((leave) => {
                const statusConfig = getStatusConfig(leave.status);

                return (
                  <tr key={leave.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                          {leave.requester.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-primary">{leave.requester.name}</div>
                          <div className="text-xs text-secondary">{leave.requester.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-secondary" />
                        <span className="text-secondary">{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-primary">{leave.hours}h</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${leave.requester.leaveBalance < 50 ? 'text-red-600' : 'text-green-600'}`}>
                          {leave.requester.leaveBalance}h
                        </span>
                        <span className="text-xs text-gray-400">/{leave.requester.contractHours}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          leave.requester.complianceStatus === 'compliant' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {leave.requester.complianceStatus === 'compliant' ? '✓ Compliant' : '✗ Non-Compliant'}
                        </span>
                        {leave.requester.complianceStatus === 'non-compliant' && (
                          <span className="text-xs text-red-600">
                            {leave.requester.trainingsDue}T, {leave.requester.documentsDue}D
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {leave.coverRequired ? (
                        <div className="space-y-1">
                          {leave.coverAssigned ? (
                            <>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-xs font-medium text-green-700">Assigned</span>
                              </div>
                              {leave.assignedCoverStaff && (
                                <span className="text-xs text-secondary">{leave.assignedCoverStaff.name}</span>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => autoAssignCover(leave.id)}
                              className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                            >
                              <AlertCircle size={14} />
                              <span className="text-xs font-medium">Auto-Assign</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-secondary">No cover needed</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onViewDetails(leave)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} className="text-gray-400 hover:text-blue-600" />
                        </button>
                        <button onClick={() => onEdit(leave)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} className="text-gray-400 hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} className="text-gray-400 hover:text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveList;