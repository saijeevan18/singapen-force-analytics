// Women & Child Safety Command Center — Mock Incident Data Generator
// Seeded random generator for reproducibility

export interface Incident {
  id: string;
  title: string;
  category:
  | 'Women Safety'
  | 'Child Safety'
  | 'Domestic Violence'
  | 'Public Harassment'
  | 'Unsafe Location Report'
  | 'Emergency SOS'
  | 'Preventive Alert'
  | 'Police Action Event';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Assigned' | 'Investigating' | 'Resolved' | 'Closed';
  region: string;
  timestamp: string;
  reporter: string;
  phone: string;
  description: string;
  assignedUnit?: string;
  latitude: number;
  longitude: number;
}

// ─── Seeded LCG random ────────────────────────────────────────────────────────
function createRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// ─── Regions ──────────────────────────────────────────────────────────────────
const REGIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
  'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Kanyakumari',
];

// Hotspot weights: higher weight → more incidents generated in that region
const REGION_WEIGHTS = [0.22, 0.14, 0.12, 0.10, 0.09, 0.08, 0.08, 0.07, 0.06, 0.04];

const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Trichy: { lat: 10.7905, lng: 78.7047 },
  Salem: { lat: 11.6643, lng: 78.1460 },
  Tirunelveli: { lat: 8.7139, lng: 77.7567 },
  Vellore: { lat: 12.9165, lng: 79.1325 },
  Erode: { lat: 11.3410, lng: 77.7172 },
  Thanjavur: { lat: 10.7870, lng: 79.1378 },
  Kanyakumari: { lat: 8.0883, lng: 77.5385 },
};

// ─── Reporter pool (repeat reporters for realism) ─────────────────────────────
const REPORTERS = [
  'Anitha Raj', 'Meena Kumari', 'Divya Nathan', 'Priya Dharshini', 'Revathi S.',
  'Janani Iyer', 'Nandini Das', 'Thamarai Selvi', 'Kavitha G.', 'Suba Lakshmi',
  'Ramesh Krishnan', 'Vijay Chandran', 'Arun Kumar', 'Ganesh Murthy', 'Hari Prasad',
  'Saravanan P.', 'Deepak Selvam', 'Karthik Raja', 'Rajesh Sekar', 'Sanjay M.',
  'Mary Selvi', 'Fatima Begum', 'Lalitha K.', 'Sumathi R.', 'Bhavani D.',
];

// ─── Incident templates per category ─────────────────────────────────────────
type CatKey = Incident['category'];

const TEMPLATES: Record<CatKey, { title: string; desc: string }[]> = {
  'Women Safety': [
    { title: 'Harassment at bus stand during night hours', desc: 'A woman reported being followed and verbally harassed by unknown males at the bus stand late at night. Bystanders were present but did not intervene.' },
    { title: 'Stalking complaint near college campus', desc: 'Female student reported a male individual following her route to college for three consecutive days. Identified near college main gate.' },
    { title: 'Eve teasing reported in public market area', desc: 'Group of men making derogatory remarks and gestures towards women shoppers in the crowded market lane.' },
    { title: 'Unsafe street lighting complaint at night', desc: 'Caller reported non-functional street lights on a key route, making women commuters vulnerable after 8 PM.' },
    { title: 'Unsafe ATM kiosk report after dark', desc: 'Woman reported feeling unsafe using an isolated ATM at night with no CCTV coverage visible.' },
    { title: 'Suspicious vehicle trailing woman commuter', desc: 'Auto-rickshaw driver followed a female passenger to her residence. License plate recorded by witness.' },
    { title: 'Night shift worker escort safety request', desc: 'Company employee requested safe escort coordination for women workers returning home after late shift ends at 11 PM.' },
  ],
  'Child Safety': [
    { title: 'Missing child last seen near school gate', desc: 'Child aged 9 did not return home after school. Last seen at the school main entrance at 3:45 PM. Parents alerted authorities.' },
    { title: 'Suspicious adult activity near playground', desc: 'Locals reported unknown adult loitering near the children\'s park, offering snacks to minors without parental consent.' },
    { title: 'Unsafe school transport vehicle reported', desc: 'Van carrying school children was seen with broken door locks and overcrowded seating. Driver appeared intoxicated.' },
    { title: 'Child safety alert near residential zone', desc: 'Multiple children seen wandering unsupervised in the industrial zone after school hours. No guardian present.' },
    { title: 'Online predator activity flagged near school', desc: 'School counsellor reported student receiving suspicious messages from unknown adult on social media.' },
    { title: 'Child labour complaint at construction site', desc: 'Child below 14 years spotted working at a construction site. NGO worker filed complaint with authorities.' },
    { title: 'Runaway minor reported at railway station', desc: 'Station staff identified a minor aged 12 wandering alone at the railway station with no accompanying adult.' },
  ],
  'Domestic Violence': [
    { title: 'Domestic violence emergency call received', desc: 'Caller reported sounds of physical altercation and screaming from a neighbouring flat. Victim believed to be female adult.' },
    { title: 'Family disturbance emergency report', desc: 'Neighbours called helpline after witnessing a male family member assault a woman in the courtyard of a residential house.' },
    { title: 'Repeated domestic abuse complaint filed', desc: 'Woman filed third complaint this month regarding physical violence by spouse. Previous cases registered but unresolved.' },
    { title: 'Dowry harassment complaint', desc: 'Woman and in-laws dispute escalated. Caller reported threats and physical confrontation over dowry demands.' },
    { title: 'Child witness to domestic violence at home', desc: 'Schoolteacher reported student showing signs of trauma; child disclosed witnessing repeated violence at home.' },
    { title: 'Marital violence emergency SOS triggered', desc: 'Woman activated emergency SOS from mobile app during active assault. Location transmitted to dispatch.' },
  ],
  'Public Harassment': [
    { title: 'Verbal abuse and intimidation near park', desc: 'Group of individuals verbally abusing and intimidating women and children near the community park entrance.' },
    { title: 'Sexual harassment in public transport', desc: 'Female commuter reported inappropriate physical contact by a co-passenger in a crowded city bus. Co-passenger identified.' },
    { title: 'Catcalling and following near shopping complex', desc: 'Women reported being followed and subjected to inappropriate remarks outside a mall. CCTV footage available.' },
    { title: "Harassing phone calls to women's helpline abused", desc: "Repeated prank and abusive calls flooding the district women's helpline disrupting emergency response." },
    { title: 'Obscene material display in public space', desc: 'Complaint regarding obscene content being displayed on a mobile device publicly in a way targeting women commuters.' },
  ],
  'Unsafe Location Report': [
    { title: 'Dark alley flagged as high-risk route', desc: 'Multiple complaints received about the unlit stretch near the drainage canal used by women commuters. No patrolling observed.' },
    { title: 'Deserted lane near school flagged unsafe', desc: 'Parents flagged a narrow lane near school premises that children use as a shortcut — no cameras or patrol present.' },
    { title: 'Isolated bus stop reported as harassment hotspot', desc: 'Women passengers report repeated harassment incidents at this outlying bus stop during early morning and evening hours.' },
    { title: 'Unsafe public toilet facility reported', desc: "Women's public restroom lacks functional locking mechanism and CCTV blind spot identified. Risk to user safety." },
    { title: 'Abandoned building flagged near women\'s hostel', desc: 'Residents of women\'s hostel flagged nearby abandoned structure being used by unknown persons after dark.' },
  ],
  'Emergency SOS': [
    { title: 'SOS activated from mobile safety app', desc: 'Emergency SOS signal received from registered safety app user. GPS coordinates transmitted. Dispatching nearest unit.' },
    { title: 'Emergency distress call from public phone', desc: 'Caller in visible distress contacted emergency helpline from a public telephone. Call dropped after partial location identified.' },
    { title: 'SOS alert from women night shelter', desc: 'Distress signal triggered from women\'s shelter app by shelter resident. Staff alerted, patrol unit dispatched.' },
    { title: 'Panic button activated in women\'s transport', desc: 'In-vehicle panic button activated in a government women\'s transport vehicle. Driver unresponsive. Route tracking initiated.' },
    { title: 'Silent SOS sent during active threat', desc: 'App user sent coded distress signal indicating presence of threat. Address confirmed from registration. Unit en route.' },
  ],
  'Preventive Alert': [
    { title: 'High-risk zone identified for increased patrol', desc: 'Analytics flagged a residential sector with 6+ harassment incidents in 72 hours. Preventive patrol deployment initiated.' },
    { title: 'Repeat harassment hotspot detected', desc: 'System flagged recurring complaints at the same location across three consecutive weeks. Zone elevated to watch status.' },
    { title: 'Unsafe area flagged for urgent patrol increase', desc: 'Cluster of 4 unsafe location reports and 2 harassment events near this corridor within 48 hours. Action required.' },
    { title: 'Night safety risk alert issued for sector', desc: 'Risk score elevated for this sector based on complaint volume, lighting gap, and low patrol frequency after 10 PM.' },
    { title: 'School route safety advisory issued', desc: 'Preventive advisory issued for school zone based on three near-miss child safety incidents reported within one week.' },
    { title: 'Festival crowd safety watch activated', desc: 'Large public gathering expected. Safety watch protocol activated to monitor and prevent opportunistic harassment.' },
  ],
  'Police Action Event': [
    { title: 'Patrol unit deployed to flagged hotspot', desc: 'Additional patrol unit deployed to the high-incident zone as part of proactive response to area risk assessment.' },
    { title: 'Suspect arrested in harassment case', desc: 'Individual identified from CCTV footage in harassment case. Suspect apprehended near incident location. Case filed.' },
    { title: 'Area surveillance increased by command', desc: 'Command center order issued to increase CCTV monitoring and foot patrolling in the designated red-zone area.' },
    { title: 'Drone monitoring activated for night zone', desc: 'Simulated drone patrol activated for isolated route during night hours as part of tech-assisted surveillance programme.' },
    { title: 'Safe zone escort operation completed', desc: 'Officer escorted group of women workers safely from factory to transit point following night shift. Operation logged.' },
    { title: 'Awareness drive conducted at school premises', desc: 'Officers conducted child safety and personal safety awareness session at school campus. 200+ students attended.' },
  ],
};

// ─── Priority rules per category ─────────────────────────────────────────────
function getPriority(cat: CatKey, rand: () => number): Incident['priority'] {
  switch (cat) {
    case 'Emergency SOS':
      return 'Critical';
    case 'Domestic Violence':
      return rand() < 0.45 ? 'Critical' : 'High';
    case 'Child Safety':
      return rand() < 0.30 ? 'Critical' : 'High';
    case 'Women Safety':
      return rand() < 0.20 ? 'Critical' : rand() < 0.60 ? 'High' : 'Medium';
    case 'Public Harassment':
      return rand() < 0.15 ? 'High' : rand() < 0.70 ? 'Medium' : 'Low';
    case 'Preventive Alert':
      return rand() < 0.40 ? 'High' : 'Medium';
    case 'Unsafe Location Report':
      return rand() < 0.25 ? 'High' : rand() < 0.70 ? 'Medium' : 'Low';
    case 'Police Action Event':
      return rand() < 0.20 ? 'High' : rand() < 0.65 ? 'Medium' : 'Low';
  }
}

// ─── Realistic status flow (no random skipping) ───────────────────────────────
function getStatus(
  priority: Incident['priority'],
  rand: () => number
): Incident['status'] {
  // Critical cases almost always progressing or active
  if (priority === 'Critical') {
    const r = rand();
    if (r < 0.18) return 'New';
    if (r < 0.40) return 'Assigned';
    if (r < 0.65) return 'Investigating';
    return 'Resolved';
  }
  if (priority === 'High') {
    const r = rand();
    if (r < 0.12) return 'New';
    if (r < 0.30) return 'Assigned';
    if (r < 0.52) return 'Investigating';
    if (r < 0.78) return 'Resolved';
    return 'Closed';
  }
  // Medium / Low — more likely resolved/closed
  const r = rand();
  if (r < 0.07) return 'New';
  if (r < 0.18) return 'Assigned';
  if (r < 0.32) return 'Investigating';
  if (r < 0.65) return 'Resolved';
  return 'Closed';
}

// ─── Weighted region picker ───────────────────────────────────────────────────
function pickRegion(rand: () => number): string {
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < REGIONS.length; i++) {
    cumulative += REGION_WEIGHTS[i];
    if (r < cumulative) return REGIONS[i];
  }
  return REGIONS[0];
}

// ─── Realistic timestamp generator ───────────────────────────────────────────
// Night hours 19–2 have 2.5× weight for Women Safety / Emergency SOS
// School hours 8–15 have 2× weight for Child Safety
function getTimestamp(
  cat: CatKey,
  rand: () => number,
  dayOffsetMax = 30
): Date {
  const date = new Date();
  date.setDate(date.getDate() - rand() * dayOffsetMax);
  date.setSeconds(0);
  date.setMilliseconds(0);
  date.setMinutes(Math.floor(rand() * 60));

  let hour: number;

  if (cat === 'Child Safety') {
    // School spike: 80% chance in 7–16 range, rest random
    if (rand() < 0.80) {
      hour = 7 + Math.floor(rand() * 9); // 7 to 15
    } else {
      hour = Math.floor(rand() * 24);
    }
  } else if (cat === 'Women Safety' || cat === 'Emergency SOS' || cat === 'Public Harassment') {
    // Night spike: 70% chance in 19–2 (7 PM – 2 AM)
    if (rand() < 0.70) {
      const nightHours = [19, 20, 21, 22, 23, 0, 1, 2];
      hour = nightHours[Math.floor(rand() * nightHours.length)];
    } else {
      hour = Math.floor(rand() * 24);
    }
  } else {
    // All other categories: uniformly distributed through the day
    hour = Math.floor(rand() * 24);
  }

  date.setHours(hour);
  return date;
}

// ─── Category distribution weights ───────────────────────────────────────────
const CATEGORIES: CatKey[] = [
  'Women Safety', 'Child Safety', 'Domestic Violence', 'Public Harassment',
  'Unsafe Location Report', 'Emergency SOS', 'Preventive Alert', 'Police Action Event',
];
// Relative weights (must sum ≈ 1)
const CAT_WEIGHTS = [0.22, 0.16, 0.14, 0.14, 0.10, 0.06, 0.10, 0.08];

function pickCategory(rand: () => number): CatKey {
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < CATEGORIES.length; i++) {
    cumulative += CAT_WEIGHTS[i];
    if (r < cumulative) return CATEGORIES[i];
  }
  return CATEGORIES[0];
}

// ─── Unit formats ─────────────────────────────────────────────────────────────
const UNIT_PREFIXES: Record<CatKey, string> = {
  'Women Safety': 'WSU',  // Women Safety Unit
  'Child Safety': 'CPS',  // Child Protection Squad
  'Domestic Violence': 'DVR',  // Domestic Violence Response
  'Public Harassment': 'PCU',  // Public Control Unit
  'Unsafe Location Report': 'INF',  // Infra Patrol
  'Emergency SOS': 'ERS',  // Emergency Response Squad
  'Preventive Alert': 'PVT',  // Preventive Team
  'Police Action Event': 'OPS',  // Operations
};

// ─── Main generator ───────────────────────────────────────────────────────────
export function generateMockIncidents(): Incident[] {
  const list: Incident[] = [];
  const rand = createRandom(42);

  // Track region incident counts for hotspot preventive alerts
  const regionCount: Record<string, number> = {};
  REGIONS.forEach(r => { regionCount[r] = 0; });

  const TOTAL = 1250;

  for (let i = 1; i <= TOTAL; i++) {
    const category = pickCategory(rand);
    const templates = TEMPLATES[category];
    const template = templates[Math.floor(rand() * templates.length)];

    const region = pickRegion(rand);
    regionCount[region]++;

    const priority = getPriority(category, rand);
    const status = getStatus(priority, rand);

    const date = getTimestamp(category, rand);

    const base = REGION_COORDS[region];
    // Cluster tighter for hotspot regions (Chennai, Coimbatore)
    const jitterScale = region === 'Chennai' ? 0.08 : region === 'Coimbatore' ? 0.10 : 0.14;
    const lat = base.lat + (rand() - 0.5) * jitterScale;
    const lng = base.lng + (rand() - 0.5) * jitterScale;

    const id = `SFA-${date.getFullYear()}-${100000 + i}`;

    // Repeat reporters: 30% of calls come from a small pool of 8 people
    let reporter: string;
    if (rand() < 0.30) {
      const repeatPool = REPORTERS.slice(0, 8);
      reporter = repeatPool[Math.floor(rand() * repeatPool.length)];
    } else {
      reporter = REPORTERS[Math.floor(rand() * REPORTERS.length)];
    }

    const phone = `+91 ${Math.floor(6000000000 + rand() * 3999999999)}`;

    const assignedUnit =
      status !== 'New'
        ? `${UNIT_PREFIXES[category]}-${region.substring(0, 3).toUpperCase()}-${100 + Math.floor(rand() * 900)}`
        : undefined;

    list.push({
      id,
      title: `${template.title} — ${region}`,
      category,
      priority,
      status,
      region,
      timestamp: date.toISOString(),
      reporter,
      phone,
      description: `${template.desc} Incident logged via command center intake. District control notified.`,
      assignedUnit,
      latitude: lat,
      longitude: lng,
    });
  }

  // ── Inject 20 hotspot-triggered Preventive Alerts for top regions ──────────
  const hotspotRegions = Object.entries(regionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([r]) => r);

  hotspotRegions.forEach((region, idx) => {
    for (let j = 0; j < 4; j++) {
      const i = TOTAL + idx * 4 + j + 1;
      const date = new Date();
      date.setDate(date.getDate() - rand() * 5); // Very recent
      date.setHours(8 + Math.floor(rand() * 14));
      date.setMinutes(Math.floor(rand() * 60));
      date.setSeconds(0);
      date.setMilliseconds(0);

      const template = TEMPLATES['Preventive Alert'][j % TEMPLATES['Preventive Alert'].length];
      const base = REGION_COORDS[region];

      list.push({
        id: `SFA-${date.getFullYear()}-${200000 + i}`,
        title: `${template.title} — ${region}`,
        category: 'Preventive Alert',
        priority: 'High',
        status: 'Assigned',
        region,
        timestamp: date.toISOString(),
        reporter: 'SFA Analytics Engine',
        phone: '+91 1090 (Hotline)',
        description: `HOTSPOT AUTO-ALERT: ${template.desc} Triggered by repeated complaint cluster in ${region}. Preventive response activated.`,
        assignedUnit: `PVT-${region.substring(0, 3).toUpperCase()}-${100 + Math.floor(rand() * 900)}`,
        latitude: base.lat + (rand() - 0.5) * 0.06,
        longitude: base.lng + (rand() - 0.5) * 0.06,
      });
    }
  });

  // Sort descending by timestamp
  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const incidents = generateMockIncidents();
