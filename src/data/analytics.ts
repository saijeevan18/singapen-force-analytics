import { Incident } from './incidents';

export interface KPIMetrics {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  criticalAlerts: number;
  avgResponseTime: number; // in minutes
}

export interface TrendData {
  date: string;
  count: number;
  critical: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RegionIncidentCount {
  region: string;
  count: number;
  active: number;
  critical: number;
}

// Colors aligned with design system
export const CATEGORY_COLORS: Record<string, string> = {
  'Women Safety':          '#EC4899', // Pink
  'Child Safety':          '#3B82F6', // Blue
  'Domestic Violence':     '#EF4444', // Red
  'Public Harassment':     '#F97316', // Orange
  'Unsafe Location Report':'#F59E0B', // Amber
  'Emergency SOS':         '#DC2626', // Deep Red
  'Preventive Alert':      '#8B5CF6', // Purple
  'Police Action Event':   '#10B981', // Green
};

export const PRIORITY_COLORS: Record<string, string> = {
  Low: '#94A3B8',      // Slate
  Medium: '#EAB308',   // Yellow
  High: '#F97316',     // Orange
  Critical: '#EF4444'  // Red
};

export const STATUS_COLORS: Record<string, string> = {
  New: '#EF4444',          // Red
  Assigned: '#3B82F6',     // Blue
  Investigating: '#8B5CF6',// Purple
  Resolved: '#10B981',     // Green
  Closed: '#64748B'        // Slate
};

export function getKPIMetrics(filteredIncidents: Incident[]): KPIMetrics {
  const total = filteredIncidents.length;
  
  const active = filteredIncidents.filter(
    inc => inc.status === 'New' || inc.status === 'Assigned' || inc.status === 'Investigating'
  ).length;
  
  const resolved = filteredIncidents.filter(
    inc => inc.status === 'Resolved' || inc.status === 'Closed'
  ).length;
  
  const critical = filteredIncidents.filter(
    inc => inc.priority === 'Critical' && (inc.status === 'New' || inc.status === 'Assigned' || inc.status === 'Investigating')
  ).length;

  // Simulate average response time
  // Critical: 5-15 mins, High: 10-25 mins, Medium: 20-45 mins, Low: 30-90 mins
  let totalResponseTime = 0;
  filteredIncidents.forEach(inc => {
    // Generate a stable pseudo-random value based on incident id
    const seed = parseInt(inc.id.split('-').pop() || '1');
    const jitter = (seed % 10) / 10; // 0 to 1
    
    if (inc.priority === 'Critical') {
      totalResponseTime += 5 + jitter * 10;
    } else if (inc.priority === 'High') {
      totalResponseTime += 10 + jitter * 15;
    } else if (inc.priority === 'Medium') {
      totalResponseTime += 20 + jitter * 25;
    } else {
      totalResponseTime += 30 + jitter * 60;
    }
  });

  const avgResponseTime = total > 0 ? Math.round(totalResponseTime / total) : 0;

  return {
    totalIncidents: total,
    activeIncidents: active,
    resolvedIncidents: resolved,
    criticalAlerts: critical,
    avgResponseTime
  };
}

// Group incidents by day for the trend chart (last 30 days)
export function getIncidentTrends(filteredIncidents: Incident[]): TrendData[] {
  const last30DaysMap: Record<string, { count: number; critical: number }> = {};
  
  // Initialize map with last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    last30DaysMap[dateStr] = { count: 0, critical: 0 };
  }

  // Populate map
  filteredIncidents.forEach(inc => {
    const d = new Date(inc.timestamp);
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (last30DaysMap[dateStr] !== undefined) {
      last30DaysMap[dateStr].count++;
      if (inc.priority === 'Critical') {
        last30DaysMap[dateStr].critical++;
      }
    }
  });

  return Object.keys(last30DaysMap).map(date => ({
    date,
    count: last30DaysMap[date].count,
    critical: last30DaysMap[date].critical
  }));
}

// Get breakdown by category
export function getCategoryDistribution(filteredIncidents: Incident[]): CategoryDistribution[] {
  const counts: Record<string, number> = {};
  
  filteredIncidents.forEach(inc => {
    counts[inc.category] = (counts[inc.category] || 0) + 1;
  });

  return Object.keys(counts).map(category => ({
    name: category,
    value: counts[category],
    color: CATEGORY_COLORS[category] || '#64748B'
  })).sort((a, b) => b.value - a.value);
}

// Get breakdown by priority
export function getPriorityDistribution(filteredIncidents: Incident[]): CategoryDistribution[] {
  const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  
  filteredIncidents.forEach(inc => {
    counts[inc.priority] = (counts[inc.priority] || 0) + 1;
  });

  return Object.keys(counts).map(priority => ({
    name: priority,
    value: counts[priority],
    color: PRIORITY_COLORS[priority]
  }));
}

// Get incident counts by region
export function getRegionAnalytics(filteredIncidents: Incident[]): RegionIncidentCount[] {
  const regionData: Record<string, { count: number; active: number; critical: number }> = {};

  filteredIncidents.forEach(inc => {
    if (!regionData[inc.region]) {
      regionData[inc.region] = { count: 0, active: 0, critical: 0 };
    }
    regionData[inc.region].count++;
    const isActive = inc.status === 'New' || inc.status === 'Assigned' || inc.status === 'Investigating';
    if (isActive) {
      regionData[inc.region].active++;
    }
    if (inc.priority === 'Critical' && isActive) {
      regionData[inc.region].critical++;
    }
  });

  return Object.keys(regionData).map(region => ({
    region,
    count: regionData[region].count,
    active: regionData[region].active,
    critical: regionData[region].critical
  })).sort((a, b) => b.count - a.count);
}
