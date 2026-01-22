import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  const option = {
    backgroundColor: 'transparent',
    grid: { left: '3%', right: '3%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0' } },
      axisLabel: { color: isDark ? '#9CA3AF' : '#64748B', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { show: false },
      splitLine: { 
        lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0', type: 'dashed' }
      },
      axisLabel: { color: isDark ? '#9CA3AF' : '#64748B', formatter: '{value}%' }
    },
    series: [{
      data: [85, 88, 92, 87, 89, 84, 82],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#10b981' },
      itemStyle: { color: '#10b981', borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
          ]
        }
      }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
      borderColor: isDark ? '#1F2937' : '#E2E8F0',
      textStyle: { color: isDark ? '#E5E7EB' : '#0F172A' }
    }
  };

  return (
    <div className="bg-secondary rounded-xl p-6 border ">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary">Rota Coverage Trend</h3>
          <p className="text-sm text-secondary">Last 7 days performance</p>
        </div>
        <select className="px-3 py-2 bg-primary border  rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-core-primary-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
};

export default LineChart;