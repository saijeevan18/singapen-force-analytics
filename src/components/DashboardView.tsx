'use client';

import React from 'react';
import { Incident } from '@/data/incidents';
import {
  getKPIMetrics,
  getIncidentTrends,
  getCategoryDistribution,
  getPriorityDistribution,
  getRegionAnalytics,
  PRIORITY_COLORS
} from '@/data/analytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  MapPin,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  incidents: Incident[];
  onOpenIncident: (incident: Incident) => void;
  selectedRegionFilter: string | null;
  onSelectRegionFilter: (region: string | null) => void;
}

export default function DashboardView({
  incidents,
  onOpenIncident,
  selectedRegionFilter,
  onSelectRegionFilter
}: DashboardViewProps) {
  const [dateFilter, setDateFilter] = React.useState<'30d' | '7d' | '24h'>('30d');
  
  // Filter incidents based on selected region and date
  const filteredIncidents = React.useMemo(() => {
    let list = incidents;
    
    // 1. Filter by Region
    if (selectedRegionFilter) {
      list = list.filter(inc => inc.region === selectedRegionFilter);
    }
    
    // 2. Filter by Date Range
    const now = new Date();
    if (dateFilter === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(inc => new Date(inc.timestamp) >= sevenDaysAgo);
    } else if (dateFilter === '24h') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      list = list.filter(inc => new Date(inc.timestamp) >= oneDayAgo);
    }
    
    return list;
  }, [incidents, selectedRegionFilter, dateFilter]);

  // Compute analytics dynamically
  const metrics = React.useMemo(() => getKPIMetrics(filteredIncidents), [filteredIncidents]);
  const trends = React.useMemo(() => getIncidentTrends(filteredIncidents), [filteredIncidents]);
  const priorities = React.useMemo(() => getPriorityDistribution(filteredIncidents), [filteredIncidents]);
  const regionsData = React.useMemo(() => getRegionAnalytics(filteredIncidents).slice(0, 8), [filteredIncidents]);

  // Extract unique regions from incidents for the dropdown
  const uniqueRegions = React.useMemo(() => {
    const set = new Set(incidents.map(i => i.region));
    return Array.from(set).sort();
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            Tactical Operations Dashboard
          </h2>
          <p className="text-xs text-slate-400">Real-time emergency telemetry for Tamil Nadu state divisions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Region Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs w-full sm:w-auto">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRegionFilter || ''}
              onChange={(e) => onSelectRegionFilter(e.target.value || null)}
              className="bg-transparent font-semibold focus:outline-none dark:text-white cursor-pointer w-full text-left"
            >
              <option value="">All Regions</option>
              {uniqueRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setDateFilter('24h')}
              className={`px-3 py-1 rounded-lg transition-colors ${dateFilter === '24h' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              24h
            </button>
            <button
              onClick={() => setDateFilter('7d')}
              className={`px-3 py-1 rounded-lg transition-colors ${dateFilter === '7d' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateFilter('30d')}
              className={`px-3 py-1 rounded-lg transition-colors ${dateFilter === '30d' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              30 Days
            </button>
          </div>

          {/* Reset Filters */}
          {(selectedRegionFilter || dateFilter !== '30d') && (
            <button
              onClick={() => {
                onSelectRegionFilter(null);
                setDateFilter('30d');
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-colors"
              title="Reset Filters"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reports</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{metrics.totalIncidents}</h3>
          </div>
        </div>

        {/* Active Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-orange-600 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Missions</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{metrics.activeIncidents}</h3>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{metrics.criticalAlerts}</h3>
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved Cases</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{metrics.resolvedIncidents}</h3>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Response</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{metrics.avgResponseTime}m</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (Line Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Incident Rate Trend</h3>
              <p className="text-[11px] text-slate-400">Total and critical reports timeline</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-bold">
              <span className="flex items-center text-blue-600"><span className="w-2.5 h-2.5 bg-blue-500 rounded-xs mr-1"></span> Total</span>
              <span className="flex items-center text-red-500"><span className="w-2.5 h-2.5 bg-red-500 rounded-xs mr-1"></span> Critical</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-[380px]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Severity Allocation</h3>
          <p className="text-[11px] text-slate-400 mb-4">Percentage breakdown by risk level</p>
          
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative">
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorities}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] font-medium w-full mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              {priorities.map((p) => {
                const totalVal = priorities.reduce((sum, item) => sum + item.value, 0);
                const percent = totalVal > 0 ? Math.round((p.value / totalVal) * 100) : 0;
                return (
                  <div key={p.name} className="flex items-center justify-between">
                    <span className="flex items-center text-slate-500 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }}></span>
                      {p.name}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Load and Recent Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Load Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-[350px]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Region Comparison</h3>
          <p className="text-[11px] text-slate-400 mb-4">Active and total incidents across top districts</p>
          
          <div className="flex-1 min-h-0 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar name="Total Cases" dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Active Cases" dataKey="active" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Operations Log (Hot Queue) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Live Operations Queue</h3>
              <p className="text-[11px] text-slate-400">Recent active status items</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredIncidents
              .filter(i => i.status !== 'Resolved' && i.status !== 'Closed')
              .slice(0, 5)
              .map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onOpenIncident(inc)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex justify-between items-center group text-left"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{inc.id}</span>
                      <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${
                        inc.priority === 'Critical' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400' :
                        inc.priority === 'High' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {inc.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {inc.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      📍 {inc.region} • {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))}
            
            {filteredIncidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All Clear</p>
                <p className="text-[10px] text-slate-400 mt-0.5">There are no pending dispatches in this sector.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
