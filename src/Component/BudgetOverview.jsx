import React from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const BudgetOverview = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const budgetData = [
    { category: 'Payroll', spent: 45000, budget: 50000, percentage: 90, trend: 5 },
    { category: 'Training', spent: 8500, budget: 12000, percentage: 71, trend: -3 },
    { category: 'Equipment', spent: 15200, budget: 18000, percentage: 84, trend: 12 },
    { category: 'Admin', spent: 5800, budget: 8000, percentage: 73, trend: -2 }
  ];

  const option = {
    backgroundColor: 'transparent',
    grid: { left: '15%', right: '3%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      splitLine: { 
        lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0', type: 'dashed' }
      },
      axisLabel: { 
        color: isDark ? '#9CA3AF' : '#64748B',
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: budgetData.map(item => item.category),
      axisLine: { lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0' } },
      axisLabel: { 
        color: isDark ? '#9CA3AF' : '#64748B',
        fontSize: 12,
        fontWeight: 600
      }
    },
    series: [{
      data: budgetData.map(item => ({
        value: item.percentage,
        itemStyle: {
          color: item.percentage >= 90 ? '#ef4444' : item.percentage >= 75 ? '#f59e0b' : '#10b981'
        }
      })),
      type: 'bar',
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        color: isDark ? '#E5E7EB' : '#0F172A',
        fontWeight: 'bold'
      },
      itemStyle: {
        borderRadius: [0, 8, 8, 0]
      }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
      borderColor: isDark ? '#1F2937' : '#E2E8F0',
      textStyle: { color: isDark ? '#E5E7EB' : '#0F172A' },
      formatter: (params) => {
        const dataIndex = params[0].dataIndex;
        const item = budgetData[dataIndex];
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${item.category}</div>
            <div>Spent: £${item.spent.toLocaleString()}</div>
            <div>Budget: £${item.budget.toLocaleString()}</div>
            <div>Usage: ${item.percentage}%</div>
          </div>
        `;
      }
    }
  };

  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const overallPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-primary">Budget Overview</h3>
          <p className="text-sm text-secondary">Monthly spending by category</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            £{totalSpent.toLocaleString()} / £{totalBudget.toLocaleString()}
          </div>
          <div className={`text-sm font-medium ${overallPercentage >= 90 ? 'text-red-500' : overallPercentage >= 75 ? 'text-orange-500' : 'text-green-500'}`}>
            {overallPercentage}% utilized
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <ReactECharts option={option} style={{ height: '300px' }} />
        </div>

        {/* Details Cards */}
        <div className="space-y-3">
          {budgetData.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-primary rounded-xl border border-border hover:border-core-primary-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary">{item.category}</span>
                <div className="flex items-center gap-1">
                  {item.trend > 0 ? (
                    <TrendingUp size={14} className="text-red-500" />
                  ) : (
                    <TrendingDown size={14} className="text-green-500" />
                  )}
                  <span className={`text-xs font-medium ${item.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.abs(item.trend)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">£{item.spent.toLocaleString()}</span>
                <span className="text-secondary">of £{item.budget.toLocaleString()}</span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.percentage >= 90 ? 'bg-red-500' : item.percentage >= 75 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;