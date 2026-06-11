# SingaPen Force Analytics (SFA) — Antigravity 1-Click Build Prompt

## IMPORTANT INSTRUCTIONS

You are an AI coding agent. Build a **fully interactive frontend-only prototype** called:

# SingaPen Force Analytics (SFA)

⚠️ STRICT RULES:
- DO NOT build backend
- DO NOT use database
- DO NOT use authentication
- DO NOT use APIs or external services
- DO NOT use API keys
- DO NOT integrate Google Maps or any external maps
- ALL DATA MUST BE MOCK DATA ONLY
- Everything must run locally inside the frontend

This is a **high-fidelity interactive dashboard prototype only**.

---

# 1. PROJECT GOAL

Build a modern enterprise-grade **Safety & Incident Management Command Center UI**.

The application should feel like a real government/enterprise control dashboard, but everything is simulated using mock data.

Users should be able to:
- Navigate dashboards
- View incidents
- Filter and search data
- Interact with charts
- Open detailed incident panels
- Use a simulated AI assistant
- Explore a regional map (SVG only)

---

# 2. TECH STACK (MANDATORY)

Use ONLY:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Framer Motion

NO other libraries unless absolutely necessary for UI.

---

# 3. APP STRUCTURE

## Layout

- Left Sidebar Navigation
- Top Navbar
- Main Content Area
- Optional Right Detail Drawer

---

## Pages to Build

### 1. Dashboard Home
- KPI Cards:
  - Total Incidents
  - Active Incidents
  - Resolved Incidents
  - Critical Alerts
  - Avg Response Time

- Charts:
  - Incident trends (line chart)
  - Severity distribution (pie chart)
  - Region comparison (bar chart)

- Filters:
  - Date filter (UI only)
  - Region filter (UI only)

---

### 2. Incident Management

Use **1200+ MOCK INCIDENTS** stored locally.

Each incident includes:
- ID
- Title
- Category
- Priority (Low / Medium / High / Critical)
- Status (New / Assigned / Investigating / Resolved / Closed)
- Region
- Timestamp

Features:
- Search incidents
- Filter by status, priority, region
- Sort by date/priority
- Click incident → open detail drawer
- Update status (LOCAL STATE ONLY, no backend)

---

### 3. Command Center (Live Simulation)

Create a “live operations feed” using simulated updates:

- Auto-updating activity feed (setInterval simulation)
- Events like:
  - Incident reported
  - Officer assigned
  - Incident escalated
  - Incident resolved

Include:
- Alert panel (critical incidents)
- Live incident queue

---

### 4. Analytics Page

Use Recharts:

- Line chart → monthly incidents
- Bar chart → region-wise incidents
- Pie chart → severity distribution
- Response time chart

All data is MOCK ONLY.

---

### 5. AI Assistant (FAKE CHAT SYSTEM)

Create a chat UI that simulates an AI assistant.

Rules:
- No real AI API
- Responses must be pre-programmed

Example behavior:

If user types:
- "show incidents" → return mock summary
- "critical incidents" → list 5 mock items
- "generate report" → show fake report message
- "help" → show guidance text

Include typing animation for realism.

---

### 6. Regional Map (NO GOOGLE MAPS)

Build a **static SVG map of Tamil Nadu**.

Features:
- Clickable regions
- Heatmap coloring based on mock incident count
- Tooltip on hover
- Region summary panel

NO external map APIs allowed.

---

# 4. DATA REQUIREMENTS

Create local mock data files:

/data/incidents.ts
/data/analytics.ts
/data/regions.ts
/data/activityFeed.ts

Include:
- At least 1200+ incidents
- Realistic Indian/Tamil Nadu-style locations
- Mixed priorities and statuses

---

# 5. UI / UX DESIGN SYSTEM

## Style
- Enterprise command center
- Government safety dashboard
- Modern SaaS UI

## Inspiration
- Stripe Dashboard
- Linear
- Vercel
- Notion Analytics

---

## Colors

- Primary: #0F172A (Deep Navy)
- Secondary: #2563EB (Blue)
- Success: #16A34A (Green)
- Warning: #F59E0B (Amber)
- Danger: #DC2626 (Red)
- Background: #F8FAFC

---

## Typography
- Font: Inter
- Bold KPIs
- Clean spacing
- Data-first layout

---

## UI Components
- KPI cards
- Tables
- Charts
- Sidebar navigation
- Modals / drawers
- Toast notifications (mock)
- Activity feed cards

---

## Animations
Use Framer Motion for:
- Page transitions
- Card hover effects
- Drawer open/close
- Feed updates

Keep animations subtle and professional.

---

# 6. INTERACTIVITY REQUIREMENTS

Even though this is a prototype:

- Filters must work (frontend only)
- Search must work (local filtering)
- Status updates must persist in state
- Charts must respond to filter changes
- Map must respond to clicks
- AI chat must respond with mock logic

---

# 7. PERFORMANCE EXPECTATION

- Fast loading
- No API calls
- No network dependency
- Fully offline runnable after build

---

# 8. FINAL OUTPUT EXPECTATION

Deliver a complete working Next.js project with:

- Clean folder structure
- Reusable components
- Mock data system
- Fully interactive UI
- Production-quality design

---

# 9. GOAL SUMMARY

Build a **fully interactive SaaS-style safety command center prototype** that looks like a real enterprise system but uses only mock data.

It must feel like a real product demo that can be shown to stakeholders.

---

END OF INSTRUCTIONS