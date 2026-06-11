'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { incidents as initialIncidents, Incident } from '@/data/incidents';
import { getInitialActivities, ActivityFeedItem } from '@/data/activityFeed';
import Sidebar, { TabType } from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/DashboardView';
import IncidentManager from '@/components/IncidentManager';
import CommandCenterView from '@/components/CommandCenterView';
import TamilNaduMap from '@/components/TamilNaduMap';
import AnalyticsView from '@/components/AnalyticsView';
import AIAssistant from '@/components/AIAssistant';
import IncidentDetailDrawer from '@/components/IncidentDetailDrawer';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  // Global States
  const [incidentsState, setIncidentsState] = useState<Incident[]>(initialIncidents);
  const [activitiesState, setActivitiesState] = useState<ActivityFeedItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Shared Filters
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string | null>(null);
  
  // Modal / Drawer Selection
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Live Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  
  // Mobile Sidebar Open
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Initialize activities feed on mount
  useEffect(() => {
    setActivitiesState(getInitialActivities(initialIncidents));
  }, []);

  // Live simulation tick interval
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setIncidentsState((prevIncidents) => {
        const rand = Math.random();
        const timestamp = new Date().toISOString();
        let newActivity: ActivityFeedItem | null = null;
        const updatedIncidents = [...prevIncidents];

        // 1. Report a new incident (35% chance)
        if (rand < 0.35) {
          const categories: Incident['category'][] = [
            'Women Safety', 'Child Safety', 'Domestic Violence',
            'Public Harassment', 'Emergency SOS', 'Preventive Alert',
            'Unsafe Location Report', 'Police Action Event'
          ];
          const regions = [
            'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
            'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Kanyakumari'
          ];
          const category = categories[Math.floor(Math.random() * categories.length)];
          const region = regions[Math.floor(Math.random() * regions.length)];

          // Priority rules matching new dataset
          let priority: Incident['priority'];
          if (category === 'Emergency SOS') {
            priority = 'Critical';
          } else if (category === 'Domestic Violence' || category === 'Child Safety') {
            priority = Math.random() < 0.4 ? 'Critical' : 'High';
          } else if (category === 'Women Safety') {
            priority = Math.random() < 0.2 ? 'Critical' : Math.random() < 0.6 ? 'High' : 'Medium';
          } else {
            priority = Math.random() < 0.3 ? 'High' : Math.random() < 0.6 ? 'Medium' : 'Low';
          }

          const id = `SFA-${new Date().getFullYear()}-${100000 + updatedIncidents.length + 1}`;
          const titles: Record<string, string> = {
            'Women Safety':           'Night safety SOS alert reported',
            'Child Safety':           'Child safety incident reported',
            'Domestic Violence':      'Domestic violence emergency call',
            'Public Harassment':      'Public harassment complaint received',
            'Emergency SOS':          'SOS activated from mobile safety app',
            'Preventive Alert':       'High-risk zone flagged for patrol',
            'Unsafe Location Report': 'Unsafe area reported by citizen',
            'Police Action Event':    'Patrol dispatched to flagged zone',
          };

          const newInc: Incident = {
            id,
            title: `${titles[category]} — ${region}`,
            category,
            priority,
            status: 'New',
            region,
            timestamp,
            reporter: 'Emergency Dispatch',
            phone: '+91 1090',
            description: 'Live incident received via command center intake. Unit dispatch initiated.',
            latitude: 9 + Math.random() * 4,
            longitude: 77 + Math.random() * 3
          };

          updatedIncidents.unshift(newInc);

          newActivity = {
            id: `act-new-${id}-${Date.now()}`,
            incidentId: id,
            incidentTitle: newInc.title,
            type: 'reported',
            message: `Emergency reported: ${newInc.title} [Priority: ${priority}]`,
            timestamp,
            region,
            priority
          };
        } else {
          // 2. Modify an existing incident status (65% chance)
          const activeIncidents = updatedIncidents.filter(inc => inc.status !== 'Closed' && inc.status !== 'Resolved');
          if (activeIncidents.length > 0) {
            const target = activeIncidents[Math.floor(Math.random() * activeIncidents.length)];
            const targetIdx = updatedIncidents.findIndex(inc => inc.id === target.id);
            const officer = [
              'Officer Kumar', 'Officer Jeeva', 'Sergeant Raj', 
              'Inspector Priya', 'Special Force Alpha', 'Officer Vijay', 'Officer Sanjay'
            ][Math.floor(Math.random() * 7)];

            if (target.status === 'New') {
              const unit = `UNIT-${target.region.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
              updatedIncidents[targetIdx] = {
                ...target,
                status: 'Assigned',
                assignedUnit: unit
              };
              newActivity = {
                id: `act-ass-${target.id}-${Date.now()}`,
                incidentId: target.id,
                incidentTitle: target.title,
                type: 'assigned',
                message: `${unit} (${officer}) dispatched to scene. Status updated to ASSIGNED.`,
                timestamp,
                region: target.region,
                priority: target.priority
              };
            } else if (target.status === 'Assigned') {
              updatedIncidents[targetIdx] = {
                ...target,
                status: 'Investigating'
              };
              newActivity = {
                id: `act-inv-${target.id}-${Date.now()}`,
                incidentId: target.id,
                incidentTitle: target.title,
                type: 'status_change',
                message: `First responders arrived at ${target.region}. Investigation is underway.`,
                timestamp,
                region: target.region,
                priority: target.priority
              };
            } else if (target.status === 'Investigating') {
              if (Math.random() < 0.3 && target.priority !== 'Critical') {
                updatedIncidents[targetIdx] = {
                  ...target,
                  priority: 'Critical'
                };
                newActivity = {
                  id: `act-esc-${target.id}-${Date.now()}`,
                  incidentId: target.id,
                  incidentTitle: target.title,
                  type: 'escalated',
                  message: `ESCALATION: Incident situation deteriorated. Priority level raised to CRITICAL.`,
                  timestamp,
                  region: target.region,
                  priority: 'Critical'
                };
              } else {
                updatedIncidents[targetIdx] = {
                  ...target,
                  status: 'Resolved'
                };
                newActivity = {
                  id: `act-res-${target.id}-${Date.now()}`,
                  incidentId: target.id,
                  incidentTitle: target.title,
                  type: 'resolved',
                  message: `${target.assignedUnit || 'First responders'} reported incident RESOLVED. Clean up completed.`,
                  timestamp,
                  region: target.region,
                  priority: target.priority
                };
              }
            }
          }
        }

        if (newActivity) {
          setActivitiesState((prevActivities) => [newActivity!, ...prevActivities]);
          
          // Sync changes to detail drawer if currently selected
          setSelectedIncident((prevSelected) => {
            if (prevSelected && prevSelected.id === newActivity!.incidentId) {
              const latestInc = updatedIncidents.find(inc => inc.id === prevSelected.id);
              return latestInc || prevSelected;
            }
            return prevSelected;
          });
        }

        return updatedIncidents;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handle manual status modifications from inside the detail drawer
  const handleUpdateIncidentStatus = useCallback((incidentId: string, newStatus: Incident['status']) => {
    setIncidentsState((prev) => {
      const nextList = prev.map(inc => {
        if (inc.id === incidentId) {
          const updated = { ...inc, status: newStatus };
          
          // Trigger activity log event for audit trail
          const timestamp = new Date().toISOString();
          let message = `System override: Status changed to ${newStatus}.`;
          let type: ActivityFeedItem['type'] = 'status_change';
          
          if (newStatus === 'Resolved') {
            message = `System override: Incident marked RESOLVED. Sector cleared.`;
            type = 'resolved';
          } else if (newStatus === 'Assigned') {
            message = `System override: Unit dispatched to emergency scene.`;
            type = 'assigned';
          }
          
          const newAct: ActivityFeedItem = {
            id: `act-manual-${incidentId}-${Date.now()}`,
            incidentId: inc.id,
            incidentTitle: inc.title,
            type,
            message,
            timestamp,
            region: inc.region,
            priority: inc.priority
          };
          
          setActivitiesState(prevActs => [newAct, ...prevActs]);
          return updated;
        }
        return inc;
      });
      return nextList;
    });
  }, []);

  // Compute active critical counts dynamically for header badge updates
  const activeCriticalCount = useMemo(() => {
    return incidentsState.filter(
      i => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed'
    ).length;
  }, [incidentsState]);

  // Handle click on incident inside charts/lists
  const handleOpenIncidentDrawer = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
  }, []);

  const handleCloseIncidentDrawer = useCallback(() => {
    setSelectedIncident(null);
  }, []);

  // Main Page renderer switch
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            incidents={incidentsState}
            onOpenIncident={handleOpenIncidentDrawer}
            selectedRegionFilter={selectedRegionFilter}
            onSelectRegionFilter={setSelectedRegionFilter}
          />
        );
      case 'incidents':
        return (
          <IncidentManager
            incidents={incidentsState}
            onOpenIncident={handleOpenIncidentDrawer}
            selectedRegionFilter={selectedRegionFilter}
            onSelectRegionFilter={setSelectedRegionFilter}
          />
        );
      case 'command':
        return (
          <CommandCenterView
            activities={activitiesState}
            incidents={incidentsState}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(p => !p)}
            onOpenIncident={handleOpenIncidentDrawer}
          />
        );
      case 'map':
        return (
          <TamilNaduMap
            incidents={incidentsState}
            onSelectRegion={setSelectedRegionFilter}
            selectedRegionFilter={selectedRegionFilter}
            onOpenIncident={handleOpenIncidentDrawer}
          />
        );
      case 'analytics':
        return <AnalyticsView incidents={incidentsState} />;
      case 'ai':
        return (
          <AIAssistant
            incidents={incidentsState}
            onOpenIncident={handleOpenIncidentDrawer}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      
      {/* Sidebar panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header toolbar */}
        <Header
          activeTab={activeTab}
          onOpenMobileNav={() => setMobileSidebarOpen(true)}
          activeCriticalCount={activeCriticalCount}
        />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto h-full">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Detail Slide-out Drawer Panel */}
      <AnimatePresence>
        {selectedIncident && (
          <IncidentDetailDrawer
            incident={selectedIncident}
            onClose={handleCloseIncidentDrawer}
            onUpdateStatus={handleUpdateIncidentStatus}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}
