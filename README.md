# Agnos Health — Patient Registration System

A real-time patient registration system with live staff monitoring, built with **Next.js 14**, **TailwindCSS**, and **Pusher Channels**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![Pusher](https://img.shields.io/badge/Pusher-Channels-6B3FA0?logo=pusher)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

### Patient Form (`/patient`)
- Full patient intake form with **13 fields** (personal info, contact, emergency contact)
- **Real-time validation** — required fields, email format, phone format, date of birth
- **Responsive design** — works seamlessly on mobile and desktop
- Clean, modern UI with smooth transitions and focus states

### Staff View (`/staff`)
- **Live monitoring dashboard** — sees every keystroke in real-time
- **Status indicators** with color-coded badges:
  - 🟢 **Actively Filling In** — patient is currently typing
  - 🟡 **Inactive** — patient stopped typing for 5+ seconds
  - 🔵 **Submitted** — form has been submitted
- **Active field highlighting** — shows which field the patient is editing
- **Progress tracking** — completion percentage bar
- **Stats overview** — filled fields count, last update time

### Real-Time Sync
- **Pusher Channels** for managed WebSocket communication
- Patient types → Next.js API Route → Pusher → Staff View (instant)
- No custom server needed — fully serverless, Vercel-compatible

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Inter font
│   ├── page.tsx                # Landing page
│   ├── patient/page.tsx        # Patient form page
│   ├── staff/page.tsx          # Staff monitoring page
│   └── api/pusher/route.ts     # API route for Pusher events
├── components/
│   ├── PatientForm.tsx         # Full form with validation & sync
│   ├── StaffDashboard.tsx      # Real-time monitoring UI
│   ├── StatusBadge.tsx         # Activity status indicator
│   ├── FieldCard.tsx           # Individual field display card
│   └── Header.tsx              # Shared navigation header
├── hooks/
│   └── usePusher.ts            # Pusher subscription hook
├── lib/
│   ├── pusher-server.ts        # Server-side Pusher instance
│   ├── pusher-client.ts        # Client-side Pusher instance
│   └── validation.ts           # Form validation utilities
└── types/
    └── form.ts                 # Shared TypeScript types
```

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- npm
- A free [Pusher](https://pusher.com) account

### 1. Clone the repository

```bash
git clone <repo-url>
cd fontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Pusher

1. Go to [pusher.com](https://pusher.com) and create a free **Channels** app
2. Copy your credentials and fill in `.env.local`:

```env
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=ap1

NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Test it!

1. Open **http://localhost:3000/patient** in one browser tab
2. Open **http://localhost:3000/staff** in another tab
3. Start typing in the patient form — watch the staff view update in real-time!

---

## 🎨 Design Decisions

### UI/UX Philosophy
- **Clean Blue & White Theme** — inspired by the Agnos brand, medical-grade aesthetic
- **Card-based layout** — easy scanning for staff, clear grouping for patients
- **Responsive-first** — mobile single column, desktop multi-column grid
- **Micro-animations** — focus rings, hover effects, pulse indicators for active fields

### Why Pusher over Socket.io?
- **Vercel compatibility** — no custom server needed, works with serverless functions
- **Managed service** — automatic scaling, no infrastructure to maintain
- **Generous free tier** — 200K messages/day, 100 concurrent connections
- **Simple API** — pub/sub pattern maps perfectly to this use case

### Component Architecture
| Component | Responsibility |
|---|---|
| `PatientForm` | Form state, validation, Pusher event emission |
| `StaffDashboard` | Pusher subscription, live data rendering |
| `StatusBadge` | Visual status indicator with animations |
| `FieldCard` | Individual field display with active highlighting |
| `Header` | Navigation and branding |

### Real-Time Flow
```
Patient types → handleChange() → debounce 80ms → POST /api/pusher
→ Pusher.trigger() → Pusher Cloud → Staff's usePusher() hook
→ setState() → UI re-render
```

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set the environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router & API routes |
| **TailwindCSS 4** | Utility-first CSS styling |
| **Pusher Channels** | Managed real-time WebSocket service |
| **TypeScript** | Type safety across the stack |

---

## 📄 License

MIT
