import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Calendar, Users, Award, Search, X, Download, Moon, Sun } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D', '#413C58', '#967AA1', '#E15759', '#76B7B2'];
const STATUS_COLORS = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444'
};

const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "August"];
const KPI_GREEN = 1562;

const PCNDashboard = () => {
  const [selectedPCN, setSelectedPCN] = useState('all');
  const [selectedManager, setSelectedManager] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

   const data = [
    { "PCN": "ARC Bucks PCN", "Account Manager": "Tabby", "Jan": "131", "Feb": "150.25", "Mar": "251.5", "April": "171.9", "May": "149", "June": "255", "July": "130.95", "August": "364.75" },
    { "PCN": "Abbey Medical Practice", "Account Manager": "Ste", "Jan": "42.5", "Feb": "8.5", "Mar": "34", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Abingdon and District PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "65.5", "Mar": "200", "April": "", "May": "", "June": "", "July": "68.5", "August": "102" },
    { "PCN": "Alliance PCN", "Account Manager": "Tabby", "Jan": "9", "Feb": "18.5", "Mar": "28.25", "April": "107", "May": "100", "June": "68.75", "July": "100", "August": "" },
    { "PCN": "Aylesbury Central PCN", "Account Manager": "Tabby", "Jan": "7.5", "Feb": "", "Mar": "5", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Blackpool North PCN", "Account Manager": "Tabby", "Jan": "65", "Feb": "25.5", "Mar": "108", "April": "30", "May": "37.5", "June": "", "July": "8.5", "August": "" },
    { "PCN": "BYTES PCN", "Account Manager": "Ste", "Jan": "", "Feb": "30", "Mar": "30", "April": "30", "May": "15", "June": "67.5", "July": "", "August": "105" },
    { "PCN": "Central Middlesborough PCN", "Account Manager": "Ste", "Jan": "3.25", "Feb": "225", "Mar": "38", "April": "283.95", "May": "30", "June": "117.25", "July": "75", "August": "19" },
    { "PCN": "Clacton PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "100.75", "Mar": "42.25", "April": "67.5", "May": "40.5", "June": "62.5", "July": "92.25", "August": "45" },
    { "PCN": "Strawberry Health PCN", "Account Manager": "Ste", "Jan": "", "Feb": "82.5", "Mar": "", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Harness North PCN", "Account Manager": "Tabby", "Jan": "22.5", "Feb": "124", "Mar": "85", "April": "54.5", "May": "15", "June": "7.5", "July": "", "August": "75" },
    { "PCN": "Dean and Central Brighton PCN", "Account Manager": "Ste", "Jan": "37.5", "Feb": "48.75", "Mar": "", "April": "18.45", "May": "18.75", "June": "21", "July": "", "August": "" },
    { "PCN": "East Merton PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "", "Mar": "", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Exeter West PCN", "Account Manager": "Ste", "Jan": "", "Feb": "", "Mar": "", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Eynsham and Witney PCN (Nuffield Health Centre)", "Account Manager": "Ste", "Jan": "112.5", "Feb": "", "Mar": "", "April": "", "May": "", "June": "18.5", "July": "", "August": "" },
    { "PCN": "Eynsham and Witney PCN (Windrush Medical Centre)", "Account Manager": "Tabby", "Jan": "", "Feb": "", "Mar": "", "April": "", "May": "27", "June": "28", "July": "16.25", "August": "" },
    { "PCN": "Gorleston PCN", "Account Manager": "Ste", "Jan": "24.5", "Feb": "47", "Mar": "85", "April": "51", "May": "17", "June": "46", "July": "16.5", "August": "119" },
    { "PCN": "Grays PCNJ", "Account Manager": "Tabby", "Jan": "9", "Feb": "56", "Mar": "17", "April": "49", "May": "91.5", "June": "38", "July": "25", "August": "" },
    { "PCN": "Harness South PCN", "Account Manager": "Tabby", "Jan": "7.5", "Feb": "39.5", "Mar": "45", "April": "30", "May": "7.5", "June": "7.5", "July": "", "August": "" },
    { "PCN": "Haverhill Family Practice (Haverhill PCN)", "Account Manager": "Ste", "Jan": "", "Feb": "9.5", "Mar": "14", "April": "43.5", "May": "32.25", "June": "", "July": "", "August": "" },
    { "PCN": "High Weald PCN", "Account Manager": "Ste", "Jan": "48.5", "Feb": "42.5", "Mar": "211.3", "April": "45", "May": "127.5", "June": "67.5", "July": "16.5", "August": "79" },
    { "PCN": "Maple PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "15", "Mar": "7.5", "April": "82.5", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Marshalls PCN", "Account Manager": "Ste", "Jan": "14.5", "Feb": "7.25", "Mar": "7", "April": "14.5", "May": "28.75", "June": "86.5", "July": "21.75", "August": "" },
    { "PCN": "Meridian PCN", "Account Manager": "Tabby", "Jan": "9", "Feb": "14.5", "Mar": "8.5", "April": "22.5", "May": "18", "June": "37.5", "July": "37.5", "August": "37.5" },
    { "PCN": "NeoHealth PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "18.75", "Mar": "30", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Newcastle South PCN", "Account Manager": "Ste", "Jan": "15", "Feb": "", "Mar": "7.5", "April": "75", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "North Merton PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "", "Mar": "", "April": "", "May": "", "June": "22.5", "July": "", "August": "" },
    { "PCN": "Panacea PCN", "Account Manager": "Tabby", "Jan": "15", "Feb": "", "Mar": "60", "April": "27.5", "May": "74", "June": "52.5", "July": "15", "August": "" },
    { "PCN": "SEOxHA PCN", "Account Manager": "Ste", "Jan": "3", "Feb": "34.5", "Mar": "15", "April": "76.5", "May": "", "June": "42", "July": "", "August": "" },
    { "PCN": "Solihull Rural PCN", "Account Manager": "Ste", "Jan": "23.5", "Feb": "39", "Mar": "", "April": "112.5", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "South Wight Medical Practice", "Account Manager": "Ste", "Jan": "", "Feb": "", "Mar": "28", "April": "", "May": "", "June": "", "July": "", "August": "" },
    { "PCN": "Southampton West PCN", "Account Manager": "Ste", "Jan": "45", "Feb": "150", "Mar": "107", "April": "48.5", "May": "30", "June": "109", "July": "54", "August": "82.5" },
    { "PCN": "Tendering PCN", "Account Manager": "Tabby", "Jan": "7", "Feb": "", "Mar": "13.75", "April": "64", "May": "26.5", "June": "6.75", "July": "", "August": "34" },
    { "PCN": "The Law Medical Group (PCN)", "Account Manager": "Tabby", "Jan": "", "Feb": "", "Mar": "", "April": "30", "May": "15", "June": "15", "July": "22.5", "August": "67.65" },
    { "PCN": "Tilbury and Chadwell PCN", "Account Manager": "Ste", "Jan": "", "Feb": "37.5", "Mar": "37.5", "April": "", "May": "", "June": "", "July": "72.5", "August": "15" },
    { "PCN": "Unity Healthcare (Haverhill PCN)", "Account Manager": "Ste", "Jan": "", "Feb": "68", "Mar": "", "April": "68", "May": "8.5", "June": "", "July": "5", "August": "" },
    { "PCN": "Wantage PCN", "Account Manager": "Tabby", "Jan": "27.5", "Feb": "", "Mar": "", "April": "44.5", "May": "7", "June": "52.5", "July": "", "August": "20" },
    { "PCN": "Wellingborough", "Account Manager": "Ste", "Jan": "", "Feb": "", "Mar": "159", "April": "80.5", "May": "47", "June": "46", "July": "19", "August": "" },
    { "PCN": "White Horse Botley PCN", "Account Manager": "Tabby", "Jan": "", "Feb": "39.5", "Mar": "", "April": "63.5", "May": "", "June": "", "July": "", "August": "" }
  ];
  const getTotalHours = (entry) => months.reduce((sum, m) => sum + (parseFloat(entry[m]) || 0), 0);

  const getKPIStatus = (total) => {
    const percent = (total / KPI_GREEN) * 100;
    if (percent >= 100) return { status: 'Green', color: STATUS_COLORS.green, icon: '✓' };
    if (percent >= 90) return { status: 'Amber', color: STATUS_COLORS.amber, icon: '⚠' };
    return { status: 'Red', color: STATUS_COLORS.red, icon: '×' };
  };

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedPCN !== 'all') filtered = filtered.filter(d => d.PCN === selectedPCN);
    if (selectedManager !== 'all') filtered = filtered.filter(d => d['Account Manager'] === selectedManager);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.PCN.toLowerCase().includes(q) || d['Account Manager'].toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [selectedPCN, selectedManager, searchQuery]);

  const kpiMetrics = useMemo(() => {
    const total = filteredData.reduce((sum, d) => sum + getTotalHours(d), 0);
    return {
      totalHours: total.toFixed(2),
      kpiPercent: ((total / KPI_GREEN) * 100).toFixed(2),
      statusInfo: getKPIStatus(total),
      pcnCount: filteredData.length
    };
  }, [filteredData]);

  const monthlyChartData = useMemo(() => months.map(month => ({
    month,
    hours: filteredData.reduce((sum, d) => sum + (parseFloat(d[month]) || 0), 0),
    target: KPI_GREEN / 8
  })), [filteredData]);

  const pieChartData = useMemo(() => monthlyChartData
    .filter(d => d.hours > 0)
    .map(d => ({ name: d.month, value: d.hours })), [monthlyChartData]);

  const managerData = useMemo(() => {
    const managers = ['Tabby', 'Ste'];
    return managers.map(m => {
      const pcns = data.filter(d => d['Account Manager'] === m);
      return { name: m, hours: pcns.reduce((sum, d) => sum + getTotalHours(d), 0), pcns: pcns.length };
    });
  }, []);

  const managerChartConfigs = useMemo(() => {
    const managers = ['Tabby', 'Ste'];
    return managers.map(manager => {
      const pcns = data.filter(d => d['Account Manager'] === manager);
      const series = pcns.map((pcn, idx) => ({
        name: pcn.PCN,
        type: 'line',
        stack: 'total',
        data: months.map(m => parseFloat(pcn[m]) || 0),
        itemStyle: { color: COLORS[idx % COLORS.length] },
        areaStyle: { opacity: 0.3 }
      }));
      return {
        manager,
        option: {
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          title: { text: `${manager}'s PCN Performance`, left: 'center', textStyle: { color: darkMode ? '#fff' : '#000' } },
          tooltip: { trigger: 'axis', confine: true },
          legend: { type: 'scroll', orient: 'horizontal', top: 30, textStyle: { color: darkMode ? '#ddd' : '#333' } },
          grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
          xAxis: { type: 'category', data: months, axisLabel: { color: darkMode ? '#ddd' : '#666' } },
          yAxis: { type: 'value', axisLabel: { color: darkMode ? '#ddd' : '#666' } },
          dataZoom: [{ type: 'inside' }, { type: 'slider', height: 20 }],
          series
        }
      };
    });
  }, [darkMode]);

  const exportCSV = () => {
    const headers = ['PCN', 'Manager', ...months, 'Total', 'Status'];
    const rows = filteredData.map(row => {
      const total = getTotalHours(row);
      const status = getKPIStatus(total).status;
      return [row.PCN, row['Account Manager'], ...months.map(m => row[m] || ''), total.toFixed(2), status].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PCN_Performance.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSelectedPCN('all');
    setSelectedManager('all');
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20 rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PCN Performance Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jan – Aug 2024 | Hours & KPI Tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg">
              <Calendar size={16} />
              Jan-Aug 2024
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto   py-6 lg:py-8">
        {/* Filters - Responsive stacking */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PCN</label>
              <select
                value={selectedPCN}
                onChange={e => setSelectedPCN(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
              >
                <option value="all">All PCNs ({data.length})</option>
                {[...new Set(data.map(d => d.PCN))].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Manager</label>
              <select
                value={selectedManager}
                onChange={e => setSelectedManager(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
              >
                <option value="all">All Managers</option>
                <option value="Tabby">Tabby</option>
                <option value="Ste">Ste</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 lg:col-start-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search PCN or manager..."
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-1 lg:justify-end">
              <button
                onClick={clearFilters}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8 lg:mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-5 md:p-6 text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium opacity-90">Total Hours</span>
              <TrendingUp size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-bold">{kpiMetrics.totalHours}</div>
            <div className="text-sm opacity-80 mt-1">{kpiMetrics.pcnCount} PCNs tracked</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-5 md:p-6 text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium opacity-90">KPI Target</span>
              <Award size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-bold">{KPI_GREEN}</div>
            <div className="text-sm opacity-80 mt-1">Green target (annual)</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-5 md:p-6 text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium opacity-90">Achievement</span>
              <TrendingUp size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-bold">{kpiMetrics.kpiPercent}%</div>
            <div className="text-sm opacity-80 mt-1">Of target achieved</div>
          </div>

          <div 
            className="rounded-xl shadow-md p-5 md:p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${kpiMetrics.statusInfo.color}40, ${kpiMetrics.statusInfo.color})` }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium opacity-90">Status</span>
              <span className="text-3xl">{kpiMetrics.statusInfo.icon}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">{kpiMetrics.statusInfo.status}</div>
            <div className="text-sm opacity-80 mt-1">Performance level</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
            <ReactECharts
              option={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                tooltip: { trigger: 'axis' },
                legend: { data: ['Hours', 'Target per month'], top: 0, textStyle: { color: darkMode ? '#ddd' : '#333' } },
                grid: { left: '4%', right: '4%', bottom: '12%', top: '12%', containLabel: true },
                xAxis: { type: 'category', data: months, axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                yAxis: { type: 'value', axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                dataZoom: [{ type: 'inside' }],
                series: [
                  { name: 'Hours', type: 'line', data: monthlyChartData.map(d => d.hours), itemStyle: { color: '#3b82f6' }, lineStyle: { width: 3 } },
                  { name: 'Target per month', type: 'line', data: monthlyChartData.map(d => d.target), itemStyle: { color: '#94a3b8' }, lineStyle: { type: 'dashed' } }
                ]
              }}
              style={{ height: '320px', width: '100%' }}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Distribution</h3>
            <ReactECharts
              option={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                tooltip: { trigger: 'item' },
                series: [{ 
                  type: 'pie', 
                  radius: ['45%', '70%'], 
                  data: pieChartData, 
                  label: { color: darkMode ? '#fff' : '#000', fontSize: 12 } 
                }]
              }}
              style={{ height: '320px', width: '100%' }}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Breakdown (Bar)</h3>
            <ReactECharts
              option={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '4%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
                xAxis: { type: 'category', data: months, axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                yAxis: { type: 'value', axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                series: [{ type: 'bar', data: monthlyChartData.map(d => d.hours), itemStyle: { color: '#6366f1' } }]
              }}
              style={{ height: '320px', width: '100%' }}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Manager Totals</h3>
            <ReactECharts
              option={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '18%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
                xAxis: { type: 'value', axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                yAxis: { type: 'category', data: managerData.map(d => d.name), axisLabel: { color: darkMode ? '#ddd' : '#666', fontSize: 12 } },
                series: [{ type: 'bar', data: managerData.map(d => d.hours), itemStyle: { color: '#10b981' } }]
              }}
              style={{ height: '320px', width: '100%' }}
            />
          </div>
        </div>

        {/* Manager-Specific Charts */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-5">Manager-Specific Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {managerChartConfigs.map(({ manager, option }) => (
              <div key={manager} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6">
                <ReactECharts 
                  option={option} 
                  style={{ height: '420px', width: '100%' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">PCN Monthly Hours</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing {filteredData.length} of {data.length} entries
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PCN</th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                  {months.map(m => (
                    <th key={m} className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{m}</th>
                  ))}
                  <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredData.map((row, idx) => {
                  const total = getTotalHours(row);
                  const statusInfo = getKPIStatus(total);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.PCN}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{row['Account Manager']}</td>
                      {months.map(m => (
                        <td key={m} className="px-3 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
                          {row[m] || '—'}
                        </td>
                      ))}
                      <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{total.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <span 
                          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${statusInfo.color}15`, 
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}30`
                          }}
                        >
                          {statusInfo.icon} {statusInfo.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PCNDashboard;