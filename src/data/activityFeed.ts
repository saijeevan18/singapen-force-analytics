import { Incident } from './incidents';

export interface ActivityFeedItem {
  id: string;
  incidentId: string;
  incidentTitle: string;
  type: 'reported' | 'assigned' | 'escalated' | 'resolved' | 'status_change';
  message: string;
  timestamp: string;
  region: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

const OFFICER_BADGES = ['Officer Kumar', 'Officer Jeeva', 'Sergeant Raj', 'Inspector Priya', 'Special Force Alpha', 'Officer Vijay', 'Officer Sanjay'];

// Generate initial activity log tied to actual incidents
export function getInitialActivities(incidents: Incident[]): ActivityFeedItem[] {
  // Let's take the first 15 incidents and build activities around them
  const initialList: ActivityFeedItem[] = [];
  const recentIncidents = incidents.slice(0, 15);
  
  recentIncidents.forEach((inc, index) => {
    const time = new Date(inc.timestamp);
    // Stagger activities a few minutes after the incident report time
    const resolvedTime = new Date(time.getTime() + 15 * 60 * 1000);
    const assignedTime = new Date(time.getTime() + 3 * 60 * 1000);
    const officer = OFFICER_BADGES[index % OFFICER_BADGES.length];

    if (inc.status === 'Resolved' || inc.status === 'Closed') {
      initialList.push({
        id: `act-res-${inc.id}-${index}`,
        incidentId: inc.id,
        incidentTitle: inc.title,
        type: 'resolved',
        message: `Incident marked RESOLVED. ${officer} confirmed issue closed successfully.`,
        timestamp: resolvedTime.toISOString(),
        region: inc.region,
        priority: inc.priority
      });
    }

    if (inc.status !== 'New') {
      initialList.push({
        id: `act-ass-${inc.id}-${index}`,
        incidentId: inc.id,
        incidentTitle: inc.title,
        type: 'assigned',
        message: `Dispatch assigned ${inc.assignedUnit || 'UNIT-ALPHA'} (${officer}) to the scene.`,
        timestamp: assignedTime.toISOString(),
        region: inc.region,
        priority: inc.priority
      });
    }

    initialList.push({
      id: `act-rep-${inc.id}-${index}`,
      incidentId: inc.id,
      incidentTitle: inc.title,
      type: 'reported',
      message: `New incident reported via hotline by ${inc.reporter}. Category: ${inc.category}.`,
      timestamp: time.toISOString(),
      region: inc.region,
      priority: inc.priority
    });

    if (inc.priority === 'Critical' && inc.status !== 'New') {
      const escalatedTime = new Date(time.getTime() + 6 * 60 * 1000);
      initialList.push({
        id: `act-esc-${inc.id}-${index}`,
        incidentId: inc.id,
        incidentTitle: inc.title,
        type: 'escalated',
        message: `ESCALATION: Incident priority bumped to CRITICAL. Sector commander informed.`,
        timestamp: escalatedTime.toISOString(),
        region: inc.region,
        priority: inc.priority
      });
    }
  });

  // Sort activities by timestamp descending
  return initialList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Generate a brand new simulation activity at runtime based on active/inactive incidents
export function generateNewActivity(
  incidents: Incident[], 
  onStateUpdate: (incidentId: string, updatedFields: Partial<Incident>) => void
): ActivityFeedItem | null {
  if (incidents.length === 0) return null;
  
  const rand = Math.random();
  const timestamp = new Date().toISOString();
  
  // 1. 35% chance to report a brand new incident
  if (rand < 0.35) {
    const categories: Incident['category'][] = [
      'Women Safety', 'Child Safety', 'Domestic Violence',
      'Public Harassment', 'Emergency SOS', 'Preventive Alert',
      'Unsafe Location Report', 'Police Action Event'
    ];
    const regions = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

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

    const id = `SFA-${new Date().getFullYear()}-${100000 + incidents.length + 1}`;
    const titles: Record<string, string> = {
      'Women Safety':           'Night safety alert received',
      'Child Safety':           'Child safety incident flagged',
      'Domestic Violence':      'Domestic violence emergency call',
      'Public Harassment':      'Public harassment complaint received',
      'Emergency SOS':          'SOS activated from safety app',
      'Preventive Alert':       'High-risk zone alert issued',
      'Unsafe Location Report': 'Unsafe area reported by citizen',
      'Police Action Event':    'Patrol deployed to flagged zone',
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

    // Callback to let the host know we want to push this to state
    onStateUpdate(id, newInc);

    return {
      id: `act-new-${id}`,
      incidentId: id,
      incidentTitle: newInc.title,
      type: 'reported',
      message: `🚨 New ${category} alert: ${newInc.title} [Priority: ${priority}]`,
      timestamp,
      region,
      priority
    };
  }

  // 2. 65% chance to modify an existing incident status (e.g. Assigning unit, resolving it)
  // Let's filter for incidents that are not Closed / Resolved
  const activeIncidents = incidents.filter(inc => inc.status !== 'Closed' && inc.status !== 'Resolved');
  if (activeIncidents.length === 0) return null;

  // Pick a random active incident
  const target = activeIncidents[Math.floor(Math.random() * activeIncidents.length)];
  const officer = OFFICER_BADGES[Math.floor(Math.random() * OFFICER_BADGES.length)];
  
  if (target.status === 'New') {
    // Escalate status to Assigned
    const unit = `UNIT-${target.region.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    onStateUpdate(target.id, { status: 'Assigned', assignedUnit: unit });
    
    return {
      id: `act-ass-${target.id}-${Date.now()}`,
      incidentId: target.id,
      incidentTitle: target.title,
      type: 'assigned',
      message: `${unit} (${officer}) dispatched to the location. Status updated to ASSIGNED.`,
      timestamp,
      region: target.region,
      priority: target.priority
    };
  } 
  
  if (target.status === 'Assigned') {
    // Escalate to Investigating
    onStateUpdate(target.id, { status: 'Investigating' });
    
    return {
      id: `act-inv-${target.id}-${Date.now()}`,
      incidentId: target.id,
      incidentTitle: target.title,
      type: 'status_change',
      message: `First responders arrived at ${target.region}. Investigation is underway.`,
      timestamp,
      region: target.region,
      priority: target.priority
    };
  }

  if (target.status === 'Investigating') {
    // Escalate priority or resolve it
    if (Math.random() < 0.3 && target.priority !== 'Critical') {
      onStateUpdate(target.id, { priority: 'Critical' });
      return {
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
      onStateUpdate(target.id, { status: 'Resolved' });
      return {
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

  return null;
}
