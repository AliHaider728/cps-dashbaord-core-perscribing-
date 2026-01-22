import React from 'react';
import ReactECharts from 'echarts-for-react';

const DonutChart = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
      borderColor: isDark ? '#1F2937' : '#E2E8F0',
      textStyle: { color: isDark ? '#E5E7EB' : '#0F172A' }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: isDark ? '#9CA3AF' : '#64748B' },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      name: 'Staff Utilization',
      type: 'pie',
      radius: ['50%', '75%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: '{a|Available}\n{b|7%}',
        rich: {
          a: { fontSize: 14, color: isDark ? '#9CA3AF' : '#64748B', lineHeight: 20 },
          b: { fontSize: 24, fontWeight: 'bold', color: isDark ? '#E5E7EB' : '#0F172A', lineHeight: 30 }
        }
      },
      labelLine: { show: false },
      data: [
        { value: 35, name: 'Nursing', itemStyle: { color: '#10b981' } },
        { value: 25, name: 'Care Staff', itemStyle: { color: '#8b5cf6' } },
        { value: 20, name: 'Support', itemStyle: { color: '#2F2CCB' } },
        { value: 13, name: 'Admin', itemStyle: { color: '#f59e0b' } },
        { value: 7, name: 'Available', itemStyle: { color: '#6b7280' } }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(47, 44, 203, 0.5)' } },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 100
    }]
  };

  return (
    <div className="bg-secondary rounded-xl p-8 border ">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary">Staff Utilization</h3>
          <p className="text-sm text-secondary">By department breakdown</p>
        </div>
        <a href="#" className="text-core-primary-500 hover:text-core-primary-400 text-sm font-medium">
          View Details →
        </a>
      </div>
      <ReactECharts option={option} style={{ height: '415px' }} />
    </div>
  );
};

export default DonutChart;