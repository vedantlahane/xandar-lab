# Xandar-Lab: Project Documentation

> **Last Updated:** February 2026

This document provides a comprehensive overview of Xandar-Lab — its vision, current implementation status, architecture decisions, and future direction.

---

## 📖 Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Current Implementation](#current-implementation)
3. [Architecture Overview](#architecture-overview)
4. [Module Breakdown](#module-breakdown)
5. [Data Models](#data-models)
6. [API Reference](#api-reference)
7. [Future Vision](#future-vision)

---

## 🎯 Vision & Philosophy

### What is Xandar-Lab?

Xandar-Lab is a **modular learning workspace** designed for developers who want to take their learning seriously. Unlike traditional platforms that gamify learning with streaks, badges, and leaderboards, Xandar-Lab focuses on the *process* of understanding.

### Core Philosophy

**"Learning is a journey, not a destination."**

| Philosophy | Traditional Platforms | Xandar-Lab |
|------------|----------------------|------------|
| **Progress Metric** | Problems solved | Understanding evolved |
| **Attempts** | Overwrite previous | Preserve as history |
| **Collaboration** | Real-time chat | Intentional, contextual |
| **UI Design** | Gamified, busy | Calm, focused |
| **Goal** | Complete the checklist | Explore the lab |

### The Lab Metaphor

We call it a "lab" intentionally:
- **Scientists experiment** — you explore concepts
- **Lab notebooks capture process** — your attempts capture learning evolution
- **Collaboration is structured** — discussions are tied to specific contexts
- **Results are documented** — resolutions reference the journey

### Design Principles

1. **Process over Performance** — Track how you learn, not just what you complete
2. **Understanding over Outcomes** — Capture intuition, not just answers
3. **Calm over Gamified** — No dopamine hooks or competitive pressure
4. **Labs over Dashboards** — A workspace, not a progress tracker

---

## 🔧 Current Implementation

### Status Overview

| Module | Status | Description |
|--------|--------|-------------|
| **Authentication** | ✅ Complete | Full auth flow with sessions |
| **Practice** | ✅ Complete | DSA problem tracking |
| **Jobs** | ✅ Complete | Job/internship tracking |
| **Profile** | ✅ Complete | User settings & stats |
| **Docs** | 📐 Scaffolded | UI ready, content pending |
| **Notes** | 📐 Scaffolded | UI ready, features pending |
| **Experiments** | 📐 Scaffolded | UI ready, sandbox pending |
| **Hackathons** | 📐 Scaffolded | UI ready, features pending |

### Authentication System

**Implementation Details:**
- JWT-based authentication using `jose` library
- Password hashing with `bcryptjs`
- Session management with device tracking
- Cookies for token storage (`cookies-next`)

**Features:**
- User registration with username/password
- Secure login with JWT tokens (7-day expiry)
- Multi-device session tracking
- Session termination (logout individual or all)
- Password change functionality
- Account deletion

**Components:**
- `AuthContext.tsx` — Global auth state provider
- `AuthForm.tsx` — Login/signup form
- `LoginModal.tsx` — Modal wrapper for auth
- `ProfileDropdown.tsx` — User menu in header
- `SessionsManager.tsx` — Device session management
- `AvatarCustomizer.tsx` — Avatar color picker

### Practice Module

**Purpose:** Master DSA concepts through curated problem sets while tracking learning evolution.

**Current Features:**
- Curated DSA problem sheet organized by topics
- Interactive problem canvas
- Problem drawer with details and links
- Saved problems tracking
- Completed problems tracking

**Components:**
- `TopicSidebar` — Topic navigation
- `ProblemCanvas` — Main problem grid
- `ProblemDrawer` — Problem details panel

**Data Structure:**
```typescript
interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
  topic: string;
}
```

### Jobs Module

**Purpose:** Track job and internship applications in one place.

**Current Features:**
- Curated job listings by category
- Job details drawer
- Save jobs for later
- Track application status
- Personal notes per job

**Components:**
- `JobCanvas` — Job listings grid
- `JobDrawer` — Job details panel

**Data Structure:**
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  link: string;
  description: string;
}
```

### Profile System

**Purpose:** Centralized user settings, stats, and preferences.

**Features:**
- Profile information editing (username, email, bio)
- Avatar customization with gradient colors
- Password management
- Session management
- Account deletion
- Stats display (saved/completed problems)

**Tabs:**
- Profile — Basic info and avatar
- Security — Password change
- Sessions — Device management
- Danger Zone — Account deletion

---

## 🏗️ Architecture Overview

### Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
├─────────────────────────────────────────────────────────┤
│  Next.js 16 (App Router) + React 19 + TypeScript       │
│  Tailwind CSS 4 + Framer Motion                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
├─────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/*)                        │
│  JWT Auth with jose + bcryptjs                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Database                            │
├─────────────────────────────────────────────────────────┤
│  MongoDB with Mongoose ODM                              │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
xandar-lab/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/           # POST - Login
│   │   │   ├── logout/          # POST - Logout
│   │   │   ├── profile/         # GET/PUT - Profile
│   │   │   ├── password/        # PUT - Change password
│   │   │   ├── account/         # DELETE - Delete account
│   │   │   ├── session/         # PUT - Update session
│   │   │   └── sessions/        # GET/DELETE - Sessions
│   │   ├── jobs/                # Job status tracking
│   │   ├── attempts/            # Practice attempts
│   │   ├── problems/            # Problem operations
│   │   ├── stats/               # User statistics
│   │   └── seed/                # Database seeding
│   │
│   ├── lab/                      # Main lab workspace
│   │   ├── layout.tsx           # Lab layout wrapper
│   │   ├── page.tsx             # Lab dashboard
│   │   ├── practice/            # DSA Practice
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   └── hooks/
│   │   ├── jobs/                # Job tracking
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   └── data/
│   │   ├── profile/             # User profile
│   │   ├── docs/                # Documentation
│   │   ├── notes/               # Notes
│   │   ├── experiments/         # Experiments
│   │   └── hackathons/          # Hackathons
│   │
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Shared components
│   ├── auth/                    # Auth components
│   └── ui/                      # UI primitives
│
├── models/                       # MongoDB schemas
│   ├── User.ts                  # User model
│   ├── Attempt.ts               # Attempt model
│   ├── Problem.ts               # Problem model
│   └── JobNote.ts               # Job notes model
│
├── lib/                          # Utilities
│   ├── db.ts                    # MongoDB connection
│   └── utils.ts                 # Helper functions
│
├── data/                         # Static data
│   ├── Nodes.ts                 # City map nodes
│   └── Edges.ts                 # City map edges
│
└── middleware.ts                 # Auth middleware
```

---

## 📊 Data Models

### User Model

```typescript
interface IUser {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  avatarGradient?: string;
  password?: string;
  savedProblems: string[];
  completedProblems: string[];
  savedJobs: string[];
  jobApplications: Map<string, string>;
  sessions: ISession[];
  createdAt: Date;
  lastLoginAt?: Date;
}

interface ISession {
  tokenId: string;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
}
```

### Attempt Model

```typescript
interface IAttempt {
  _id: string;
  problemId: string;
  userId: string;
  status: 'attempting' | 'resolved';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login/register user |
| `/api/auth/logout` | POST | Logout current session |
| `/api/auth/profile` | GET | Get user profile |
| `/api/auth/profile` | PUT | Update user profile |
| `/api/auth/password` | PUT | Change password |
| `/api/auth/account` | DELETE | Delete account |
| `/api/auth/sessions` | GET | Get all sessions |
| `/api/auth/sessions` | DELETE | Terminate sessions |
| `/api/auth/session` | PUT | Update session activity |

### Jobs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs/status` | GET | Get job statuses |
| `/api/jobs/status` | PUT | Update job status |
| `/api/jobs/[id]/notes` | GET | Get job notes |
| `/api/jobs/[id]/notes` | POST | Add job note |

### Practice

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/problems/save` | POST | Save/unsave problem |
| `/api/problems/complete` | POST | Mark problem complete |
| `/api/attempts` | GET | Get user attempts |
| `/api/attempts` | POST | Create attempt |
| `/api/stats` | GET | Get user stats |

---

## 🔮 Future Vision

### Near-Term Goals (Phase 2)

1. **Attempt Versioning**
   - Multiple attempts per problem
   - Version history with diffs
   - Lineage visualization

2. **Notes Module**
   - Markdown-based notes
   - Link notes to problems
   - Tag-based organization

3. **Docs Module**
   - Interactive documentation
   - Code examples with execution
   - Concept explanations

### Medium-Term Goals (Phase 3)

1. **Shared Labs**
   - Create shared workspaces
   - Invite collaborators
   - Permission management

2. **Cross-Module Linking**
   - Link notes ↔ practice ↔ docs
   - Unified search across modules
   - Knowledge graph visualization

3. **Export/Import**
   - Export learning data
   - Import from other platforms
   - Backup and restore

### Long-Term Vision

1. **AI-Assisted Learning**
   - Smart problem recommendations
   - Learning pattern analysis
   - Personalized study plans

2. **Community Features**
   - Public profiles (opt-in)
   - Discussion forums
   - Study groups

3. **Mobile App**
   - React Native companion
   - Offline support
   - Cross-device sync

---

## 🎨 Design Language

### Color Palette

The UI uses a carefully curated color system:

- **Background**: Clean, minimal surfaces
- **Accent Colors**: Muted, professional tones
- **Status Colors**: Clear but not alarming
- **Gradients**: Subtle, purposeful

### Animation Philosophy

- **Entrance**: Subtle fade + blur
- **Interaction**: Quick, responsive
- **Feedback**: Clear but not distracting
- **Duration**: 200-500ms typically

### Typography

- **Primary**: System fonts (Inter-like)
- **Monospace**: Code blocks and IDs
- **Hierarchy**: Clear size/weight distinctions

---

## 🤝 Contributing

This project is currently in active development by [Vedant Lahane](https://github.com/vedantlahane).

If you're interested in contributing, please:
1. Check the roadmap for planned features
2. Open an issue to discuss your idea
3. Fork and submit a pull request

---

## 📞 Contact

- **Author**: Vedant Lahane
- **GitHub**: [@vedantlahane](https://github.com/vedantlahane)
- **Project**: [xandar-lab](https://github.com/vedantlahane/xandar-lab)

---

*"Xandar-Lab treats learning like version control for understanding."*
