import React from 'react';
import ReactECharts from 'echarts-for-react';

const BarChart = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const option = {
    backgroundColor: 'transparent',
    grid: { left: '3%', right: '3%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0' } },
      axisLabel: { color: isDark ? '#9CA3AF' : '#64748B' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: isDark ? '#1F2937' : '#E2E8F0', type: 'dashed' } },
      axisLabel: { color: isDark ? '#9CA3AF' : '#64748B', formatter: '£{value}k' }
    },
    series: [{
      data: [45, 52, 48, 58, 54, 65],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: (params) => {
          if (params.dataIndex === 5) {
            return '#8b5cf6';
          }
          return {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#2F2CCB' },
              { offset: 1, color: '#1E1B8F' }
            ]
          };
        }
      },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(47, 44, 203, 0.3)' } }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
      borderColor: isDark ? '#1F2937' : '#E2E8F0',
      textStyle: { color: isDark ? '#E5E7EB' : '#0F172A' },
      formatter: '{b}: £{c}k'
    }
  };

  return (
    <div className="bg-secondary rounded-xl p-6 border ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-primary">Monthly Revenue</h3>
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">+12%</span>
        </div>
        <a href="#" className="text-core-primary-500 hover:text-core-primary-400 text-sm font-medium">
          View Report →
        </a>
      </div>
      <ReactECharts option={option} style={{ height: '280px' }} />
    </div>
  );
};

export default BarChart;