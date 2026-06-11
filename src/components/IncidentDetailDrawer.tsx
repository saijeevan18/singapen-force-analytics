'use client';

import React from 'react';
import { Incident } from '@/data/incidents';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/data/analytics';
import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  ShieldAlert, 
  AlertOctagon, 
  Radio, 
  CheckCircle2, 
  Archive,
  Compass,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateStatus: (incidentId: string, newStatus: Incident['status']) => void;
}

export default function IncidentDetailDrawer({
  incident,
  onClose,
  onUpdateStatus
}: IncidentDetailDrawerProps) {
  if (!incident) return null;

  const statusOptions: { value: Incident['status']; label: string; icon: React.ReactNode }[] = [
    { value: 'New', label: 'Mark New', icon: <AlertOctagon className="w-3.5 h-3.5" /> },
    { value: 'Assigned', label: 'Assign Dispatch', icon: <Radio className="w-3.5 h-3.5" /> },
    { value: 'Investigating', label: 'Under Investigation', icon: <Compass className="w-3.5 h-3.5" /> },
    { value: 'Resolved', label: 'Resolve Case', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { value: 'Closed', label: 'Close & Archive', icon: <Archive className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 text-left"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white flex justify-between items-start">
          <div className="space-y-1.5 min-w-0 pr-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-400">{incident.id}</span>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: `${PRIORITY_COLORS[incident.priority]}25`,
                  color: PRIORITY_COLORS[incident.priority]
                }}
              >
                {incident.priority}
              </span>
            </div>
            <h3 className="text-base font-bold leading-snug truncate" title={incident.title}>
              {incident.title}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 dark:hover:bg-slate-900 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Badge Group */}
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Operations Status:</div>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold"
              style={{
                backgroundColor: `${STATUS_COLORS[incident.status]}15`,
                color: STATUS_COLORS[incident.status]
              }}
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              {incident.status}
            </span>
          </div>

          {/* Incident Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Situation Overview
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </p>
          </div>

          {/* Incident Metadata Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Deployment Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Region */}
              <div className="flex items-start space-x-3 text-xs bg-slate-50/50 dark:bg-slate-850 p-3 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Sector District</div>
                  <div className="font-bold text-slate-700 dark:text-slate-250 mt-0.5">{incident.region}</div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-start space-x-3 text-xs bg-slate-50/50 dark:bg-slate-850 p-3 rounded-xl">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Reported Time</div>
                  <div className="font-bold text-slate-700 dark:text-slate-250 mt-0.5">
                    {new Date(incident.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </div>
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="flex items-start space-x-3 text-xs bg-slate-50/50 dark:bg-slate-850 p-3 rounded-xl">
                <Compass className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Coordinates (GPS)</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-250 mt-0.5">
                    {incident.latitude.toFixed(4)}° N, {incident.longitude.toFixed(4)}° E
                  </div>
                </div>
              </div>

              {/* Assigned Unit */}
              <div className="flex items-start space-x-3 text-xs bg-slate-50/50 dark:bg-slate-850 p-3 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Assigned Patrol</div>
                  <div className="font-bold text-slate-700 dark:text-slate-250 mt-0.5">
                    {incident.assignedUnit || 'UNASSIGNED'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caller/Reporter Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Citizen Reporting Source
            </h4>
            <div className="bg-slate-50/50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-4 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5" /> Reporter
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-250">{incident.reporter}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5" /> Verified Phone
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-250">{incident.phone}</span>
              </div>
            </div>
          </div>

          {/* Status Update Options */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Tactical Actions / Reassign Status
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((opt) => {
                const isActive = incident.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (!isActive) {
                        onUpdateStatus(incident.id, opt.value);
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-300 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {opt.icon}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
}
