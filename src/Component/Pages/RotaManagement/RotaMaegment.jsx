import React, { useState } from 'react';
import { Search, Plus, Download, Trash2, Edit, Eye, Filter, X, ChevronDown, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const RotaMangement = ({ staffData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample leave data
  const leaveData = [
    {
      id: 1,
      requester: {
        name: 'Aishah Pathan',
        avatar: 'AP',
        role: 'Clinical Pharmacist'
      },
      fromDate: '2026-03-05',
      toDate: '2026-03-05',
      hours: 9.00,
      leaveType: 'Annual Leave (PCN)',
      additionalInfo: '9hrs shift cover needed',
      status: 'pending',
      approvers: ['Arslan Shahroz', 'Stephen Elliott', 'Tabassum Khan'],
      appliedDate: '2026-01-26'
    },
    {
      id: 2,
      requester: {
        name: 'Amina Hakim',
        avatar: 'AH',
        role: 'Senior Pharmacist'
      },
      fromDate: '2026-04-01',
      toDate: '2026-04-10',
      hours: 45.00,
      leaveType: 'Annual Leave (PCN)',
      additionalInfo: 'Extended annual leave',
      status: 'pending',
      approvers: ['Arslan Shahroz', 'Samantha Louise Warring Davies', 'Stephen Elliott', 'Tabassum Khan'],
      appliedDate: '2026-01-26'
    },
    {
      id: 3,
      requester: {
        name: 'Amina Hakim',
        avatar: 'AH',
        role: 'Senior Pharmacist'
      },
      fromDate: '2026-03-30',
      toDate: '2026-03-31',
      hours: 15.00,
      leaveType: 'Annual Leave (PCN)',
      additionalInfo: 'End of month leave',
      status: 'pending',
      approvers: ['Arslan Shahroz', 'Samantha Louise Warring Davies', 'Stephen Elliott', 'Tabassum Khan'],
      appliedDate: '2026-01-26'
    },
    {
      id: 4,
      requester: {
        name: 'SM Badrul Hyder',
        avatar: 'SH',
        role: 'Pharmacist'
      },
      fromDate: '2026-01-26',
      toDate: '2026-01-27',
      hours: 18.50,
      leaveType: 'Annual Leave (PCN)',
      additionalInfo: '',
      status: 'approved',
      approvers: ['Arslan Shahroz', 'Samantha Louise Warring Davies', 'Stephen Elliott', 'Tabassum Khan'],
      appliedDate: '2026-01-26'
    },
    {
      id: 5,
      requester: {
        name: 'John Smith',
        avatar: 'JS',
        role: 'Clinical Lead'
      },
      fromDate: '2026-02-15',
      toDate: '2026-02-20',
      hours: 37.50,
      leaveType: 'Sick Leave',
      additionalInfo: 'Medical certificate attached',
      status: 'rejected',
      approvers: ['Arslan Shahroz', 'Stephen Elliott'],
      appliedDate: '2026-01-25'
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pending',
        icon: AlertCircle,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500'
      },
      approved: {
        label: 'Approved',
        icon: CheckCircle,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500'
      },
      rejected: {
        label: 'Rejected',
        icon: XCircle,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        dotColor: 'bg-rose-500'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const calculateDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredLeaves = leaveData.filter(leave => {
    const matchesSearch = leave.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeaves(filteredLeaves.map(l => l.id));
    } else {
      setSelectedLeaves([]);
    }
  };

  const handleSelectLeave = (id) => {
    setSelectedLeaves(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const stats = {
    total: leaveData.length,
    pending: leaveData.filter(l => l.status === 'pending').length,
    approved: leaveData.filter(l => l.status === 'approved').length,
    rejected: leaveData.filter(l => l.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Leave Management</h2>
          <p className="text-sm text-secondary">Manage and track staff leave requests</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
            <Plus size={18} />
            <span>New Leave Request</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border text-primary rounded-xl hover:bg-primary transition-all duration-200 font-medium">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-rose-600">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <XCircle className="text-rose-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-primary rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search by name, leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary hover:bg-primary transition-colors font-medium"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedLeaves.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-sm font-medium text-blue-900">
              {selectedLeaves.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                Approve
              </button>
              <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium">
                Reject
              </button>
              <button 
                onClick={() => setSelectedLeaves([])}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-primary rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-border">
                <th className="px-4 py-4 text-left">
                  <input 
                    type="checkbox"
                    checked={selectedLeaves.length === filteredLeaves.length && filteredLeaves.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Requester</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Leave Period</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Duration</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Leave Type</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Approvers</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeaves.map((leave) => {
                const statusConfig = getStatusConfig(leave.status);
                const StatusIcon = statusConfig.icon;
                const days = calculateDays(leave.fromDate, leave.toDate);

                return (
                  <tr 
                    key={leave.id} 
                    className="hover:bg-secondary/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <input 
                        type="checkbox"
                        checked={selectedLeaves.includes(leave.id)}
                        onChange={() => handleSelectLeave(leave.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0">
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
                        <span className="text-secondary">
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </span>
                      </div>
                      {leave.additionalInfo && (
                        <div className="text-xs text-secondary mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {leave.additionalInfo}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-primary">{days} day{days > 1 ? 's' : ''}</span>
                        <span className="text-xs text-secondary">{leave.hours} hours</span>
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
                      <div className="flex items-center gap-1">
                        {leave.approvers.slice(0, 3).map((approver, idx) => (
                          <div 
                            key={idx}
                            className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold -ml-2 first:ml-0 border-2 border-white dark:border-gray-800"
                            title={approver}
                          >
                            {approver.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                        ))}
                        {leave.approvers.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-xs font-semibold -ml-2 border-2 border-white dark:border-gray-800">
                            +{leave.approvers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn" title="View Details">
                          <Eye size={16} className="text-gray-400 group-hover/btn:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn" title="Edit">
                          <Edit size={16} className="text-gray-400 group-hover/btn:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors group/btn" title="Delete">
                          <Trash2 size={16} className="text-gray-400 group-hover/btn:text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLeaves.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No results found</h3>
            <p className="text-secondary">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredLeaves.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-primary rounded-xl border border-border">
          <div className="text-sm text-secondary">
            Showing <span className="font-semibold text-primary">{filteredLeaves.length}</span> of <span className="font-semibold text-primary">{leaveData.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium shadow-md">
              1
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-primary">
              2
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-primary">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotaMangement;