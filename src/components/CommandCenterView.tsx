'use client';

import React from 'react';
import { ActivityFeedItem } from '@/data/activityFeed';
import { Incident } from '@/data/incidents';
import { PRIORITY_COLORS } from '@/data/analytics';
import { 
  Radio, 
  Play, 
  Pause, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  PlusCircle, 
  MapPin, 
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandCenterViewProps {
  activities: ActivityFeedItem[];
  incidents: Incident[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenIncident: (incident: Incident) => void;
}

export default function CommandCenterView({
  activities,
  incidents,
  isSimulating,
  onToggleSimulation,
  onOpenIncident
}: CommandCenterViewProps) {

  // Get active critical alerts (alert panel)
  const criticalAlerts = React.useMemo(() => {
    return incidents
      .filter(inc => inc.priority === 'Critical' && inc.status !== 'Resolved' && inc.status !== 'Closed')
      .slice(0, 8);
  }, [incidents]);

  // Live incident queue (active, sorted by newest)
  const activeQueue = React.useMemo(() => {
    return incidents
      .filter(inc => inc.status !== 'Resolved' && inc.status !== 'Closed')
      .slice(0, 10);
  }, [incidents]);

  const getActivityIcon = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'reported':
        return <PlusCircle className="w-4 h-4 text-blue-500" />;
      case 'assigned':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'status_change':
        return <Radio className="w-4 h-4 text-amber-500" />;
    }
  };

  const getActivityColor = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'reported':
        return 'border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/10';
      case 'assigned':
        return 'border-l-purple-500 bg-purple-50/20 dark:bg-purple-950/10';
      case 'escalated':
        return 'border-l-red-500 bg-red-50/30 dark:bg-red-950/20';
      case 'resolved':
        return 'border-l-green-500 bg-green-50/20 dark:bg-green-950/10';
      case 'status_change':
        return 'border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controller Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-white shadow-md">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="relative">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSimulating ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-800'}`}>
              <Terminal className={`w-5 h-5 ${isSimulating ? 'text-green-500' : 'text-slate-400'}`} />
            </div>
            {isSimulating && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <h3 className="text-sm font-bold">Live Dispatch Simulation</h3>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${isSimulating ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                {isSimulating ? 'OPERATIONAL' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isSimulating 
                ? 'Simulating real-time regional calls, unit dispatches, and emergency communications.' 
                : 'Telemetry updates paused. Toggle play to start incoming live feed simulation.'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSimulation}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            isSimulating
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/10'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Feed</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Feed</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactical Communications Log Feed (Chronological events) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
              <Radio className="w-4 h-4 text-blue-600 mr-1.5 animate-pulse" />
              Tactical Radio Log
            </h3>
            <p className="text-[11px] text-slate-400">Dispatcher transmissions and unit operations logs</p>
          </div>

          {/* Activity Feed Scrollbox */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <AnimatePresence initial={false}>
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    const matchedInc = incidents.find(i => i.id === act.incidentId);
                    if (matchedInc) onOpenIncident(matchedInc);
                  }}
                  className={`p-3.5 border border-slate-200 dark:border-slate-800 border-l-4 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-left flex justify-between items-start gap-4 ${getActivityColor(act.type)}`}
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-150 dark:border-slate-700/50">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{act.incidentId}</span>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{act.region}</span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                        {act.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                        Ref: {act.incidentTitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-[8px] font-extrabold px-1 rounded uppercase tracking-wider flex-shrink-0"
                    style={{
                      backgroundColor: `${PRIORITY_COLORS[act.priority]}15`,
                      color: PRIORITY_COLORS[act.priority]
                    }}
                  >
                    {act.priority}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {activities.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Radio className="w-8 h-8 text-slate-300 mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">No Transmissions Active</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Waiting for tactical dispatches. Ensure simulation is set to resume.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side widgets (Radar alerts and Live Queue) */}
        <div className="space-y-6 flex flex-col h-[600px]">
          {/* Critical Alerts panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Critical Radar alerts
              </h3>
              <span className="text-[10px] font-extrabold px-1.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg">
                {criticalAlerts.length} Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {criticalAlerts.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onOpenIncident(inc)}
                  className="p-2.5 bg-red-50/30 dark:bg-red-950/10 border border-red-100 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer flex justify-between items-center text-left"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] font-mono text-red-500 font-extrabold">{inc.id}</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                      {inc.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5 text-slate-400" /> {inc.region}
                    </p>
                  </div>
                  <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 animate-pulse" />
                </div>
              ))}

              {criticalAlerts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-6">
                  <CheckCircle className="w-7 h-7 text-green-500 mb-1" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No High Threat Alerts</p>
                  <p className="text-[10px] text-slate-400">All critical priority situations are resolved.</p>
                </div>
              )}
            </div>
          </div>

          {/* Live dispatch queue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col flex-1 h-0">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
                <Activity className="w-4 h-4 mr-1.5 text-blue-600" />
                Dispatch Operations Queue
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">
                {activeQueue.length} Pending
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activeQueue.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onOpenIncident(inc)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex justify-between items-center text-left"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-mono text-slate-400">{inc.id}</span>
                      <span className={`text-[8px] font-extrabold px-1.5 rounded ${
                        inc.status === 'New' ? 'bg-red-100 text-red-700' :
                        inc.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 mt-1">
                      {inc.title}
                    </h4>
                  </div>
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </div>
              ))}

              {activeQueue.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-6">
                  <CheckCircle className="w-7 h-7 text-green-500 mb-1" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Queue Cleared</p>
                  <p className="text-[10px] text-slate-400">All emergency reports resolved in system state.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
