import React, { useState } from 'react';
import KPICard from '../KPICard';
import LineChart from '../LineChart';
import DonutChart from '../DonutChart';
import BarChart from '../BarChart';
import ComplianceList from '../ComplianceList';
import UnfilledShifts from '../UnfilledShifts';
import RecentActivity from '../RecentActivity';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  AlertCircle, 
  Receipt, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Award,
  Target,
  Activity,
  Briefcase,
  Hospital,
  Building2,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // NEW COMPREHENSIVE DATA
  const dashboardData = {
    // STAFF METRICS
    totalStaff: 45,
    activeStaff: 42,
    onLeave: 3,
    nonCompliant: 5,
    
    // FINANCIAL METRICS
    totalRevenue: 450000,
    monthlyRevenue: 37500,
    outstandingInvoices: 15000,
    paidInvoices: 22500,
    projectedRevenue: 480000,
    
    // CONTRACT METRICS
    activeContracts: 28,
    expiringContracts: 4,
    totalContractValue: 650000,
    contractHours: 92000,
    
    // LEAVE METRICS
    totalLeaves: 156,
    pendingLeaves: 12,
    approvedLeaves: 128,
    rejectedLeaves: 16,
    totalLeaveHours: 3840,
    averageLeaveBalance: 156,
    lowBalanceStaff: 8,
    
    // CLIENT METRICS
    totalClients: 18,
    pcns: 8,
    standalone: 10,
    activeProjects: 24,
    
    // KPI METRICS
    utilizationRate: 87,
    satisfactionScore: 4.6,
    complianceRate: 88,
    timesheetSubmission: 94,
    invoiceAccuracy: 96,
    leaveUtilization: 42
  };

  // UPCOMING LEAVES
  const upcomingLeaves = [
    { name: 'Hassan Raza', fromDate: '2026-02-12', toDate: '2026-02-14', hours: 22.5, status: 'pending' },
    { name: 'John Smith', fromDate: '2026-02-20', toDate: '2026-02-22', hours: 22.5, status: 'pending' },
    { name: 'Sara Mahmood', fromDate: '2026-03-03', toDate: '2026-03-03', hours: 7.5, status: 'approved' },
    { name: 'Mike Williams', fromDate: '2026-02-18', toDate: '2026-02-19', hours: 15, status: 'approved' }
  ];

  // EXPIRING CONTRACTS
  const expiringContracts = [
    { client: 'Richmond PCN', expiryDate: '2026-03-31', value: 45000, status: 'expiring-soon', daysLeft: 60 },
    { client: 'Westfield Network', expiryDate: '2026-04-15', value: 38000, status: 'expiring-soon', daysLeft: 75 },
    { client: 'Clacton PCN', expiryDate: '2026-05-20', value: 42000, status: 'renewal-due', daysLeft: 110 }
  ];

  // TOP PERFORMERS
  const topPerformers = [
    { name: 'Dr. Sarah Johnson', hours: 180, revenue: 15000, compliance: 100, avatar: 'SJ' },
    { name: 'Mike Williams', hours: 175, revenue: 14500, compliance: 100, avatar: 'MW' },
    { name: 'Emma Brown', hours: 172, revenue: 14200, compliance: 95, avatar: 'EB' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Timeframe Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">Dashboard Overview</h1>
          <p className="text-sm text-secondary">Complete business intelligence & operational metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* EXISTING KPI Cards Grid - KEEPING YOUR ORIGINAL DESIGN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          icon={CheckCircle}
          value="87%"
          title="Shift Coverage"
          subtitle="14,275 filled"
          status="success"
        />
        <KPICard
          icon={AlertTriangle}
          value="21"
          title="Open Rota Gaps"
          subtitle="This week"
          status="urgent"
          badge="Urgent"
        />
        <KPICard
          icon={FileText}
          value={dashboardData.pendingLeaves.toString()}
          title="Pending Leave"
          subtitle="Awaiting approval"
          status="review"
          badge="Review"
        />
        <KPICard
          icon={AlertCircle}
          value={dashboardData.nonCompliant.toString()}
          title="Compliance Expiring"
          subtitle="Next 7 days"
          status="alert"
          badge="Alert"
        />
        <KPICard
          icon={Receipt}
          value="17"
          title="Outstanding Invoices"
          subtitle="Total overdue"
          status="invoice"
          badge={`£${(dashboardData.outstandingInvoices / 1000).toFixed(1)}k`}
        />
        <KPICard
          icon={TrendingUp}
          value={`${dashboardData.utilizationRate}%`}
          title="Staff Utilization"
          subtitle="340 avg vs 440 target"
          status="target"
          badge="On Target"
        />
      </div>

      {/* NEW: ADDITIONAL KPI METRICS ROW */}
      <div className="bg-gradient-to-r from-core-primary-50 to-core-primary-100 dark:from-core-primary-950/30 dark:to-core-primary-900/30 rounded-xl border border-core-primary-200 dark:border-core-primary-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-core-primary-600 dark:text-core-primary-400" size={24} />
          <h2 className="text-xl font-bold text-primary">Extended Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {/* Total Staff */}
          <div className="bg-primary rounded-lg p-4 border border-core-primary-100 dark:border-core-primary-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-core-primary-600 dark:text-core-primary-400" size={18} />
              <ArrowUpRight className="text-green-600 dark:text-green-500" size={14} />
            </div>
            <p className="text-xs text-secondary mb-1">Total Staff</p>
            <p className="text-2xl font-bold text-core-primary-600 dark:text-core-primary-400">{dashboardData.totalStaff}</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">{dashboardData.activeStaff} Active</p>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-primary rounded-lg p-4 border border-green-100 dark:border-green-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-green-600 dark:text-green-500" size={18} />
              <ArrowUpRight className="text-green-600 dark:text-green-500" size={14} />
            </div>
            <p className="text-xs text-secondary mb-1">Monthly Rev</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">£{(dashboardData.monthlyRevenue / 1000).toFixed(0)}k</p>
            <p className="text-xs text-secondary mt-1">+12% MoM</p>
          </div>

          {/* Active Contracts */}
          <div className="bg-primary rounded-lg p-4 border border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="text-purple-600 dark:text-purple-500" size={18} />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-500">{dashboardData.expiringContracts}</span>
            </div>
            <p className="text-xs text-secondary mb-1">Contracts</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">{dashboardData.activeContracts}</p>
            <p className="text-xs text-rose-600 dark:text-rose-500 mt-1">{dashboardData.expiringContracts} Expiring</p>
          </div>

          {/* Total Leaves */}
          <div className="bg-primary rounded-lg p-4 border border-amber-100 dark:border-amber-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-amber-600 dark:text-amber-500" size={18} />
              <Clock className="text-amber-600 dark:text-amber-500" size={14} />
            </div>
            <p className="text-xs text-secondary mb-1">Total Leaves</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{dashboardData.totalLeaves}</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">{dashboardData.approvedLeaves} Approved</p>
          </div>

          {/* Satisfaction Score */}
          <div className="bg-primary rounded-lg p-4 border border-rose-100 dark:border-rose-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-rose-600 dark:text-rose-500" size={18} />
              <span className="text-xs font-bold text-green-600 dark:text-green-500">✓</span>
            </div>
            <p className="text-xs text-secondary mb-1">Satisfaction</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-500">{dashboardData.satisfactionScore}/5</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">Excellent</p>
          </div>

          {/* Compliance Rate */}
          <div className="bg-primary rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Target className="text-core-primary-600 dark:text-core-primary-400" size={18} />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-500">!</span>
            </div>
            <p className="text-xs text-secondary mb-1">Compliance</p>
            <p className="text-2xl font-bold text-core-primary-600 dark:text-core-primary-400">{dashboardData.complianceRate}%</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">{dashboardData.nonCompliant} Issues</p>
          </div>

          {/* Total Clients */}
          <div className="bg-primary rounded-lg p-4 border border-teal-100 dark:border-teal-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Hospital className="text-teal-600 dark:text-teal-500" size={18} />
              <Building2 className="text-teal-600 dark:text-teal-500" size={14} />
            </div>
            <p className="text-xs text-secondary mb-1">Clients</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-500">{dashboardData.totalClients}</p>
            <p className="text-xs text-secondary mt-1">{dashboardData.pcns}P + {dashboardData.standalone}S</p>
          </div>

          {/* Leave Balance */}
          <div className="bg-primary rounded-lg p-4 border border-orange-100 dark:border-orange-900/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-600 dark:text-orange-500" size={18} />
              <AlertTriangle className="text-orange-600 dark:text-orange-500" size={14} />
            </div>
            <p className="text-xs text-secondary mb-1">Low Balance</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">{dashboardData.lowBalanceStaff}</p>
            <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">Need Alert</p>
          </div>
        </div>
      </div>

      {/* NEW: QUICK INSIGHTS - 3 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Leaves */}
        <div className="bg-secondary rounded-xl border border-DEFAULT overflow-hidden">
          <div className="px-6 py-4 border-b border-DEFAULT bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Upcoming Leaves</h3>
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold">
                {dashboardData.pendingLeaves} Pending
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {upcomingLeaves.map((leave, idx) => (
              <div key={idx} className="bg-primary rounded-lg p-3 border border-DEFAULT hover:border-core-primary-300 dark:hover:border-core-primary-700 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-primary text-sm">{leave.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    leave.status === 'approved' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {leave.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-secondary mb-1">
                  <Calendar size={12} />
                  <span>{leave.fromDate}</span>
                </div>
                <div className="text-xs text-secondary">
                  <span className="font-semibold text-core-primary-600 dark:text-core-primary-400">{leave.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Contracts */}
        <div className="bg-secondary rounded-xl border border-DEFAULT overflow-hidden">
          <div className="px-6 py-4 border-b border-DEFAULT bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Expiring Contracts</h3>
              <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold">
                {dashboardData.expiringContracts}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {expiringContracts.map((contract, idx) => (
              <div key={idx} className="bg-primary rounded-lg p-3 border border-DEFAULT hover:border-rose-300 dark:hover:border-rose-700 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-primary text-sm">{contract.client}</span>
                  <AlertCircle className="text-rose-500 dark:text-rose-400" size={16} />
                </div>
                <div className="flex items-center gap-2 text-xs text-secondary mb-1">
                  <Calendar size={12} />
                  <span>{contract.expiryDate} ({contract.daysLeft}d)</span>
                </div>
                <div className="text-xs text-secondary">
                  Value: <span className="font-semibold text-green-600 dark:text-green-500">£{contract.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-secondary rounded-xl border border-DEFAULT overflow-hidden">
          <div className="px-6 py-4 border-b border-DEFAULT bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Top Performers</h3>
              <Award className="text-purple-600 dark:text-purple-500" size={20} />
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-primary rounded-lg p-3 border border-DEFAULT hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-core-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {performer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary text-sm truncate">{performer.name}</div>
                  <div className="flex items-center gap-3 text-xs text-secondary">
                    <span>{performer.hours}h</span>
                    <span>£{(performer.revenue / 1000).toFixed(1)}k</span>
                    <span className={`font-bold ${
                      performer.compliance === 100 
                        ? 'text-green-600 dark:text-green-500' 
                        : 'text-amber-600 dark:text-amber-500'
                    }`}>
                      {performer.compliance}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-muted">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXISTING Charts Row 1 - KEPT AS IS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <LineChart />
        </div>
        <div>
          <ComplianceList />
        </div>
      </div>

      {/* EXISTING Charts Row 2 - KEPT AS IS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UnfilledShifts />
        </div>
        <div className="lg:col-span-1">
          <DonutChart />
        </div>
      </div>

      {/* EXISTING Charts Row 3 - KEPT AS IS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BarChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* NEW: FINANCIAL SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 dark:bg-green-700 rounded-xl flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">£{dashboardData.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Paid</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-500">£{(dashboardData.paidInvoices / 1000).toFixed(1)}k</p>
            </div>
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Outstanding</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-500">£{(dashboardData.outstandingInvoices / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-core-primary-50 to-core-primary-100 dark:from-core-primary-950/30 dark:to-core-primary-900/30 rounded-xl p-6 border border-core-primary-200 dark:border-core-primary-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-core-primary-600 dark:bg-core-primary-700 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Contract Value</p>
              <p className="text-2xl font-bold text-core-primary-600 dark:text-core-primary-400">£{dashboardData.totalContractValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Active</p>
              <p className="text-lg font-bold text-core-primary-600 dark:text-core-primary-400">{dashboardData.activeContracts}</p>
            </div>
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Expiring</p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-500">{dashboardData.expiringContracts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 dark:bg-purple-700 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Leave Hours</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">{dashboardData.totalLeaveHours.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Avg Balance</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-500">{dashboardData.averageLeaveBalance}h</p>
            </div>
            <div className="bg-primary rounded-lg p-3">
              <p className="text-xs text-secondary mb-1">Low Balance</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-500">{dashboardData.lowBalanceStaff}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;