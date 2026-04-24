# Development Planning Documentation

## Agnos Health — Patient Registration System (Real-Time)

---

## 1. Project Structure

```
fontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout — Inter font, SEO metadata, global providers
│   │   ├── page.tsx                  # Landing page — navigation hub to Patient/Staff
│   │   ├── globals.css               # Global styles — theme, scrollbar, transitions
│   │   ├── patient/
│   │   │   └── page.tsx              # Patient Form page — wraps PatientForm component
│   │   ├── staff/
│   │   │   └── page.tsx              # Staff View page — wraps StaffDashboard component
│   │   └── api/
│   │       └── pusher/
│   │           └── route.ts          # API Route — receives form updates, triggers Pusher events
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── Header.tsx                # Shared navigation bar with Agnos branding
│   │   ├── PatientForm.tsx           # Main form — 13 fields, validation, real-time sync
│   │   ├── StaffDashboard.tsx        # Monitoring dashboard — live data, status, progress
│   │   ├── StatusBadge.tsx           # Animated badge showing patient activity status
│   │   └── FieldCard.tsx             # Individual field display card for staff view
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── usePusher.ts              # Pusher channel subscription & state management
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── pusher-server.ts          # Server-side Pusher instance (singleton)
│   │   ├── pusher-client.ts          # Client-side Pusher-js instance (singleton)
│   │   └── validation.ts             # Form validation — required, email, phone, DOB
│   │
│   └── types/                        # Shared TypeScript definitions
│       └── form.ts                   # Form types, field labels, options, constants
│
├── .env.local                        # Environment variables (Pusher credentials)
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS for TailwindCSS
├── README.md                         # Project overview & setup guide
└── DEVELOPMENT_PLANNING.md           # This file
```

### Why this structure?

- **`app/` directory** — Uses Next.js App Router for file-based routing. Each route is a folder with `page.tsx`.
- **`components/`** — Separates UI logic from page logic. Each component has a single responsibility.
- **`hooks/`** — Encapsulates Pusher subscription logic away from components.
- **`lib/`** — Utility code shared between server (API routes) and client (components).
- **`types/`** — Central type definitions ensure consistency between Patient Form and Staff View.

---

## 2. Design — UI/UX Decisions

### 2.1 Visual Theme

| Element | Choice | Reason |
|---|---|---|
| **Color Palette** | Blue (#2563EB) + White (#FFFFFF) | Medical/healthcare aesthetic, matches Agnos brand identity |
| **Typography** | Inter (Google Fonts) | Clean, modern, highly readable at all sizes |
| **Border Radius** | `rounded-xl` (12px) | Soft, approachable feel for a medical form |
| **Shadows** | Subtle `shadow-sm` | Adds depth without visual clutter |
| **Animations** | Pulse, transitions | Active field indicator, status badge animations |

### 2.2 Responsive Design Strategy

#### Mobile (< 640px)
- **Patient Form**: Single column layout — all fields stack vertically
- **Staff View**: Single column cards — easy thumb scrolling
- **Header**: Condensed nav labels ("Form" / "View" instead of "Patient Form" / "Staff View")
- **Submit button**: Full width for easy tap target

#### Tablet (640px – 1024px)
- **Patient Form**: 2-column grid for name fields, contact fields
- **Staff View**: 2-column card grid
- **Stats bar**: 2x2 grid

#### Desktop (> 1024px)
- **Patient Form**: 3-column grid for names, 2-column for other sections
- **Staff View**: 3-column card grid for field cards
- **Stats bar**: 4-column single row
- **Max width**: 768px (form), 1024px (dashboard) — prevents over-stretching

### 2.3 UX Decisions

| Decision | Reasoning |
|---|---|
| **Sectioned form (4 groups)** | Reduces cognitive load — users process info in chunks |
| **Numbered sections** | Clear progress indication — users know where they are |
| **Inline validation** | Immediate feedback on blur — prevents submission errors |
| **Required field markers (*)** | Standard medical form convention |
| **Placeholder text** | Shows expected format (e.g., "+66 12 345 6789") |
| **Success state with animation** | Positive confirmation after submission |
| **Glassmorphism header** | `backdrop-blur-md` — modern, non-intrusive navigation |

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
RootLayout (layout.tsx)
├── Header                    ← Shared across all pages
│
├── Landing Page (page.tsx)
│   └── Navigation Cards      ← Links to /patient and /staff
│
├── Patient Page (patient/page.tsx)
│   └── PatientForm           ← Main form component
│       ├── Form Fields (13)  ← Controlled inputs with validation
│       ├── Error Messages    ← Inline validation feedback
│       └── Submit Button     ← Triggers form submission
│
└── Staff Page (staff/page.tsx)
    └── StaffDashboard         ← Real-time monitoring
        ├── StatusBadge        ← Patient activity indicator
        ├── Stats Bar (4)      ← Status, filled count, active field, last update
        ├── Progress Bar       ← Completion percentage
        └── FieldCard (13)     ← Individual field displays
```

### 3.2 Component Details

#### `PatientForm.tsx` — The Patient's Interface
**Role:** Collects patient data and broadcasts changes in real-time.

| Feature | Implementation |
|---|---|
| State management | `useState` for each of 13 fields |
| Real-time sync | On every keystroke → debounced 80ms → `POST /api/pusher` |
| Validation | On blur: validates individual field. On submit: validates all |
| Activity tracking | Sends "active" status on first type, "inactive" after 5s idle |
| Error display | Conditional render with red border + error message |

#### `StaffDashboard.tsx` — The Staff's Interface
**Role:** Displays live patient data as it's being typed.

| Feature | Implementation |
|---|---|
| Real-time data | `usePusher()` hook subscribes to `patient-form` channel |
| Field display | Renders 13 `FieldCard` components grouped by category |
| Status tracking | `StatusBadge` shows Active/Inactive/Submitted |
| Stats overview | 4 stat cards: Status, Fields Filled, Active Field, Last Update |
| Progress bar | Percentage calculation of filled vs total fields |

#### `StatusBadge.tsx` — Visual Status Indicator
**Role:** Shows the current patient activity status.

| Status | Visual | Trigger |
|---|---|---|
| ⏳ Waiting | Gray, idle icon | Initial state (no patient connected) |
| 🟢 Actively Filling In | Green, pulse animation | Patient starts typing |
| 🟡 Inactive | Amber, sleep icon | No typing for 5+ seconds |
| 🔵 Submitted | Blue, checkmark | Form submitted successfully |

#### `FieldCard.tsx` — Individual Field Display
**Role:** Shows a single field's label and live value on the staff dashboard.

- Highlights with blue border + ping animation when field is actively being edited
- Shows "Required" tag for mandatory fields
- Displays cursor blink animation for currently active field
- Gray placeholder ("—") when field is empty

#### `Header.tsx` — Navigation Bar
**Role:** Consistent navigation across all pages.

- Sticky top with glassmorphism (`backdrop-blur-md`)
- Agnos logo with gradient text
- Active page indicator (blue background pill)
- Responsive: shorter labels on mobile

---

## 4. Real-Time Flow

### 4.1 Architecture Overview

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Patient    │       │  Next.js API │       │    Pusher    │       │    Staff     │
│   Browser    │──────▶│    Route     │──────▶│    Cloud     │──────▶│   Browser    │
│  (Form)      │ POST  │ /api/pusher  │trigger│  (WebSocket) │  push │ (Dashboard)  │
└──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘
```

### 4.2 Detailed Event Flow

#### Step 1: Patient Types a Character
```
Patient types "J" in First Name
  → handleChange("firstName", "J") is called
  → setState updates local form immediately (no lag for patient)
  → Debounce timer starts (80ms)
```

#### Step 2: Debounced API Call
```
After 80ms of no new keystrokes:
  → fetch("POST /api/pusher", {
      event: "form-update",
      data: { field: "firstName", value: "J", activeField: "firstName" }
    })
```

#### Step 3: Server Triggers Pusher
```
API Route receives POST:
  → pusher.trigger("patient-form", "form-update", {
      field: "firstName",
      value: "J",
      activeField: "firstName",
      timestamp: 1713970800000
    })
```

#### Step 4: Staff View Updates
```
usePusher() hook receives event:
  → channel.bind("form-update", (data) => {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, firstName: "J" },
        activeField: "firstName"
      }))
    })
  → React re-renders FieldCard for "firstName" with value "J"
  → FieldCard shows blue highlight + ping animation
```

### 4.3 Status Change Flow

```
Patient starts typing
  → Send "status-change" { status: "active" }
  → Staff sees green "Actively Filling In" badge

Patient stops typing for 5 seconds
  → Inactivity timer fires
  → Send "status-change" { status: "inactive" }
  → Staff sees amber "Inactive" badge

Patient clicks Submit
  → Send "form-submitted" { data: allFormData }
  → Send "status-change" { status: "submitted" }
  → Staff sees blue "Submitted" badge + all final data
```

### 4.4 Three Pusher Events

| Event Name | Triggered When | Data Payload |
|---|---|---|
| `form-update` | Every keystroke (debounced 80ms) | `{ field, value, activeField, timestamp }` |
| `status-change` | Activity state changes | `{ status: "active"|"inactive"|"submitted", timestamp }` |
| `form-submitted` | Form is submitted | `{ data: PatientFormData, timestamp }` |

### 4.5 Why Pusher Instead of Socket.io?

| Factor | Socket.io | Pusher (Chosen) |
|---|---|---|
| **Vercel Deploy** | ❌ Needs custom server | ✅ Works with serverless |
| **Infrastructure** | Self-managed | Managed cloud service |
| **Scaling** | Manual | Automatic |
| **Setup complexity** | High (custom server.ts) | Low (API route + client) |
| **Free tier** | N/A | 200K msg/day, 100 connections |
| **Reliability** | Depends on hosting | 99.997% uptime SLA |

---

## 5. Technology Decisions Summary

| Decision | Choice | Alternative Considered | Reason |
|---|---|---|---|
| Framework | Next.js 14 (App Router) | Pages Router | Modern, better layouts, API routes built-in |
| Styling | TailwindCSS 4 | CSS Modules, Styled Components | Rapid development, consistent design tokens |
| Real-time | Pusher Channels | Socket.io, Firebase, Supabase | Vercel-compatible, simplest for pub/sub |
| Language | TypeScript | JavaScript | Type safety between form and dashboard |
| Font | Inter | System fonts | Professional, medical-grade readability |
| Validation | Custom (lib/validation.ts) | Zod, Yup, React Hook Form | Lightweight, no extra dependencies |
| State | React useState | Zustand, Redux | Simple enough for single-form state |
| Hosting | Vercel | Heroku, Netlify | Native Next.js support, automatic deploys |
