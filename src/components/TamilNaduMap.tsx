'use client';

import React, { useState } from 'react';
import { RegionData, regions } from '@/data/regions';
import { Incident } from '@/data/incidents';
import { MapPin, Users, ShieldAlert, Award, FileText } from 'lucide-react';

interface TamilNaduMapProps {
  incidents: Incident[];
  onSelectRegion: (regionName: string | null) => void;
  selectedRegionFilter: string | null;
  onOpenIncident: (incident: Incident) => void;
}

export default function TamilNaduMap({
  incidents,
  onSelectRegion,
  selectedRegionFilter,
  onOpenIncident
}: TamilNaduMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(
    regions.find(r => r.name === selectedRegionFilter) || null
  );

  // Calculate stats for each region based on current incidents state
  const regionStats = React.useMemo(() => {
    const stats: Record<string, { total: number; active: number; critical: number }> = {};
    
    // Initialize all regions with 0
    regions.forEach(r => {
      stats[r.name] = { total: 0, active: 0, critical: 0 };
    });

    incidents.forEach(inc => {
      if (stats[inc.region]) {
        stats[inc.region].total++;
        const isActive = inc.status !== 'Resolved' && inc.status !== 'Closed';
        if (isActive) {
          stats[inc.region].active++;
          if (inc.priority === 'Critical') {
            stats[inc.region].critical++;
          }
        }
      }
    });

    return stats;
  }, [incidents]);

  // Find max active count for heatmap scale normalization
  const maxActiveCount = React.useMemo(() => {
    let max = 1;
    Object.values(regionStats).forEach(s => {
      if (s.active > max) max = s.active;
    });
    return max;
  }, [regionStats]);

  // Heatmap color generator
  const getHeatmapColor = (regionName: string, isSelected: boolean) => {
    const stats = regionStats[regionName] || { active: 0 };
    const ratio = stats.active / maxActiveCount;
    
    if (isSelected) {
      // Vivid highlighted blue/violet
      return `rgb(59, 130, 246)`;
    }

    // Gradient from cold blue to warm/alert crimson based on incident load
    // Low: light slate/blue, High: deep indigo/rose
    if (stats.active === 0) {
      return 'rgb(226, 232, 240)'; // slate-200
    }
    
    // Interpolate color values
    const r = Math.round(15 + ratio * 210); // 15 to 225
    const g = Math.round(23 + (1 - ratio) * 100); // 23 to 123
    const b = Math.round(42 + (1 - ratio) * 180); // 42 to 222
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleRegionClick = (region: RegionData) => {
    if (selectedRegion?.id === region.id) {
      setSelectedRegion(null);
      onSelectRegion(null);
    } else {
      setSelectedRegion(region);
      onSelectRegion(region.name);
    }
  };

  const currentRegion = selectedRegion || hoveredRegion;
  const currentStats = currentRegion ? regionStats[currentRegion.name] : null;

  // Get recent 5 active incidents in selected region
  const regionIncidents = React.useMemo(() => {
    if (!currentRegion) return [];
    return incidents
      .filter(inc => inc.region === currentRegion.name && inc.status !== 'Resolved' && inc.status !== 'Closed')
      .slice(0, 5);
  }, [incidents, currentRegion]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Map Column */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Regional Safety Heatmap</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive map representing incident intensity in Tamil Nadu. Click region to filter dashboards.
          </p>
        </div>

        {/* Heatmap Legend */}
        <div className="absolute top-20 right-6 flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 text-xs">
          <span className="text-slate-500">Low Risk</span>
          <div className="w-24 h-2 rounded bg-gradient-to-r from-slate-200 via-indigo-400 to-red-600"></div>
          <span className="text-slate-500">High Alert</span>
        </div>

        {/* SVG Container */}
        <div className="flex-1 flex items-center justify-center p-2 min-h-[400px]">
          <svg
            viewBox="0 0 520 620"
            className="w-full max-h-[500px] select-none filter drop-shadow-md"
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            {/* Draw connections/grid lines for sci-fi look */}
            <g stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" className="dark:opacity-0.1">
              <line x1="100" y1="0" x2="100" y2="620" />
              <line x1="200" y1="0" x2="200" y2="620" />
              <line x1="300" y1="0" x2="300" y2="620" />
              <line x1="400" y1="0" x2="400" y2="620" />
              <line x1="0" y1="100" x2="520" y2="100" />
              <line x1="0" y1="200" x2="520" y2="200" />
              <line x1="0" y1="300" x2="520" y2="300" />
              <line x1="0" y1="400" x2="520" y2="400" />
              <line x1="0" y1="500" x2="520" y2="500" />
            </g>

            {/* Render Regions */}
            <g>
              {regions.map((region) => {
                const isSelected = selectedRegion?.id === region.id;
                const isHovered = hoveredRegion?.id === region.id;
                const stats = regionStats[region.name] || { active: 0 };
                const fillColor = getHeatmapColor(region.name, isSelected);

                return (
                  <g key={region.id}>
                    <polygon
                      points={region.points}
                      fill={fillColor}
                      stroke={isSelected ? '#ffffff' : '#475569'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      strokeOpacity={isSelected ? 1 : 0.4}
                      className="transition-all duration-200 cursor-pointer hover:filter hover:brightness-110"
                      onClick={() => handleRegionClick(region)}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                    
                    {/* Render Text Label */}
                    <text
                      x={region.centerX}
                      y={region.centerY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={stats.active > maxActiveCount * 0.5 && !isSelected ? '#ffffff' : '#1e293b'}
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none dark:fill-white/90 filter drop-shadow-sm"
                    >
                      {region.name}
                    </text>

                    {/* Small dot indicating alert state */}
                    {stats.critical > 0 && (
                      <circle
                        cx={region.centerX + 18}
                        cy={region.centerY - 8}
                        r="4"
                        className="fill-red-500 animate-pulse pointer-events-none"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Info Panel Column */}
      <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {currentRegion && currentStats ? (
          <div className="flex-1 flex flex-col h-full transition-opacity duration-300">
            {/* Header info */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-2">
                {currentRegion.zone} Zone
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <MapPin className="w-5 h-5 mr-1.5 text-blue-600" />
                {currentRegion.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentRegion.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Population
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentRegion.population}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Area Size
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentRegion.area}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1 text-orange-500" />
                    Active Incidents
                  </span>
                  {currentStats.critical > 0 && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-semibold px-1.5 py-0.5 rounded">
                      {currentStats.critical} CRITICAL
                    </span>
                  )}
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {currentStats.active}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {currentStats.total} total reported
                  </span>
                </div>
              </div>
            </div>

            {/* Active Incident List */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Active Incidents in Region
              </h4>
              
              {regionIncidents.length > 0 ? (
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[200px] lg:max-h-none">
                  {regionIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => onOpenIncident(inc)}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-mono text-slate-500">{inc.id}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          inc.priority === 'Critical' ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400' :
                          inc.priority === 'High' ? 'bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400' :
                          inc.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-400' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}>
                          {inc.priority}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">
                        {inc.title.replace(` at ${inc.region}`, '')}
                      </h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex justify-between">
                        <span>{inc.category}</span>
                        <span>{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/20 text-center">
                  <Award className="w-8 h-8 text-green-500 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All Clear</p>
                  <p className="text-[10px] text-slate-400">No active emergency logs in this district.</p>
                </div>
              )}
            </div>

            {/* Filter Toggle Button */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onSelectRegion(selectedRegionFilter === currentRegion.name ? null : currentRegion.name);
                }}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
                  selectedRegionFilter === currentRegion.name
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {selectedRegionFilter === currentRegion.name
                  ? 'Clear Regional Dashboard Filter'
                  : `Filter Dashboard to ${currentRegion.name}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="relative mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 animate-ping"></div>
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Region Selected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Hover over or click regions on the map to display real-time tactical insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
