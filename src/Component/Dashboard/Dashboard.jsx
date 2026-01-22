import React from 'react';
import KPICard from '../KPICard';
import LineChart from '../LineChart';
import DonutChart from '../DonutChart';
import BarChart from '../BarChart';
import ComplianceList from '../ComplianceList';
import UnfilledShifts from '../UnfilledShifts';
import RecentActivity from '../RecentActivity';
import { CheckCircle, AlertTriangle, FileText, AlertCircle, Receipt, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
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
          value="8"
          title="Pending Leave"
          subtitle="Awaiting approval"
          status="review"
          badge="Review"
        />
        <KPICard
          icon={AlertCircle}
          value="12"
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
          badge="£24.5k"
        />
        <KPICard
          icon={TrendingUp}
          value="78%"
          title="Staff Utilization"
          subtitle="340 avg vs 440 target"
          status="target"
          badge="On Target"
        />
      </div>

      {/* Charts Row 1 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <LineChart 
           />
        </div>
        <div>
          <ComplianceList />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UnfilledShifts />
        </div>
        <div className="lg:col-span-1">
          <DonutChart />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BarChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;