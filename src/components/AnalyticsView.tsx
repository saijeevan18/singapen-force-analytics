'use client';

import React from 'react';
import { Incident } from '@/data/incidents';
import {
  getKPIMetrics,
  getIncidentTrends,
  getCategoryDistribution,
  getPriorityDistribution,
  getRegionAnalytics,
  CATEGORY_COLORS,
  PRIORITY_COLORS
} from '@/data/analytics';
import {
  AreaChart,
  Area,
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
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Clock, 
  MapPin, 
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';

interface AnalyticsViewProps {
  incidents: Incident[];
}

export default function AnalyticsView({ incidents }: AnalyticsViewProps) {
  // Aggregate data dynamically from incidents array to match state updates
  const metrics = React.useMemo(() => getKPIMetrics(incidents), [incidents]);
  const trends = React.useMemo(() => getIncidentTrends(incidents), [incidents]);
  const categories = React.useMemo(() => getCategoryDistribution(incidents), [incidents]);
  const priorities = React.useMemo(() => getPriorityDistribution(incidents), [incidents]);
  const regions = React.useMemo(() => getRegionAnalytics(incidents), [incidents]);

  // Compute average response times by priority dynamically
  const responseTimesByPriority = React.useMemo(() => {
    const weights: Record<string, { total: number; count: number }> = {
      Critical: { total: 0, count: 0 },
      High: { total: 0, count: 0 },
      Medium: { total: 0, count: 0 },
      Low: { total: 0, count: 0 }
    };

    incidents.forEach(inc => {
      const seed = parseInt(inc.id.split('-').pop() || '1');
      const jitter = (seed % 10) / 10;
      
      let resTime = 0;
      if (inc.priority === 'Critical') resTime = 5 + jitter * 10;
      else if (inc.priority === 'High') resTime = 10 + jitter * 15;
      else if (inc.priority === 'Medium') resTime = 20 + jitter * 25;
      else resTime = 30 + jitter * 60;

      weights[inc.priority].total += resTime;
      weights[inc.priority].count++;
    });

    return Object.keys(weights).map(priority => ({
      priority,
      avgTime: weights[priority].count > 0 
        ? Math.round(weights[priority].total / weights[priority].count) 
        : 0
    }));
  }, [incidents]);

  // Simulated operational stats
  const operationalStats = React.useMemo(() => {
    const activeCount = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    const criticalCount = incidents.filter(i => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed').length;

    // Busiest hour simulation
    const hourCounts: Record<number, number> = {};
    incidents.forEach(i => {
      const date = new Date(i.timestamp);
      const hour = date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let busiestHour = 0;
    let maxHourCount = 0;
    Object.keys(hourCounts).forEach(h => {
      const hour = Number(h);
      if (hourCounts[hour] > maxHourCount) {
        maxHourCount = hourCounts[hour];
        busiestHour = hour;
      }
    });

    const formatHour = (h: number) => {
      const suffix = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 || 12;
      return `${formatted}:00 ${suffix}`;
    };

    return {
      activeUnits: Math.round(activeCount * 1.2) + 14,
      busiestTime: formatHour(busiestHour),
      resolutionRate: incidents.length > 0 
        ? Math.round((resolvedCount / incidents.length) * 100) 
        : 0,
      dispatchSuccessRate: 98
    };
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Patrol Units</span>
            <ShieldAlert className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">{operationalStats.activeUnits}</h3>
          <p className="text-[10px] text-green-500 font-semibold mt-1">✓ Units deployed in active beats</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">{operationalStats.resolutionRate}%</h3>
          <p className="text-[10px] text-slate-400 mt-1">Average closed vs reported reports</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Peak Alert Hour</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">{operationalStats.busiestTime}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Time period with highest incident density</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hotline Efficiency</span>
            <Flame className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">{operationalStats.dispatchSuccessRate}%</h3>
          <p className="text-[10px] text-slate-400 mt-1">Simulated dispatch communication accuracy</p>
        </div>
      </div>

      {/* Charts Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Incident Volume (Line/Area) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-blue-600" />
                Incident Trend & Operations load
              </h3>
              <p className="text-[11px] text-slate-400">Chronological daily incident mapping</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region comparison bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                Regional Alert Density
              </h3>
              <p className="text-[11px] text-slate-400">Total incident comparisons by district</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="region" type="category" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
              <PieIcon className="w-4 h-4 mr-1.5 text-purple-600" />
              Category Classification Split
            </h3>
            <p className="text-[11px] text-slate-400">Total reports grouped by primary category type</p>
          </div>
          
          <div className="flex-1 min-h-0 flex flex-col sm:flex-row items-center justify-between">
            <div className="w-full sm:w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
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
            
            {/* List labels */}
            <div className="w-full sm:w-1/2 flex flex-col space-y-1.5 text-[11px] font-medium pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-850 pt-4 sm:pt-0">
              {categories.map((c) => {
                const total = categories.reduce((sum, item) => sum + item.value, 0);
                const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
                return (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="flex items-center text-slate-500 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-sm mr-2" style={{ backgroundColor: c.color }}></span>
                      {c.name}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.value} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Avg Response Time Chart (Bar chart by priority) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-emerald-600" />
              Target Dispatch response Speed
            </h3>
            <p className="text-[11px] text-slate-400">Average response latency in minutes by severity index</p>
          </div>
          
          <div className="flex-1 min-h-0 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimesByPriority} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="priority" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { textAnchor: 'middle', fontSize: '9px' } }} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value} minutes`, 'Avg Time']}
                />
                <Bar dataKey="avgTime" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35}>
                  {responseTimesByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
