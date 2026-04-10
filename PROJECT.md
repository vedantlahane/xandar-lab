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
| **Authentication** | ✅ Complete | JWT + NextAuth v5, multi-device sessions |
| **Practice** | ✅ Complete | DSA problem tracking with attempts |
| **Jobs** | ✅ Complete | Job/internship tracking & notes |
| **Profile** | ✅ Complete | User settings, stats, avatar customization |
| **Ideas** | 🔄 Active | LLM-powered idea generator with signals |
| **Community** | 🔄 Active | Feed, posts, sharing, engagement |
| **Docs** | 🔄 Active | Explanations with feedback system |
| **Interviews** | 🔄 Active | AI-powered interview practice |
| **Notes** | 📐 In Dev | Markdown notes with tagging |
| **Experiments** | 📐 In Dev | Code sandbox structure |
| **Hackathons** | 📐 In Dev | Hackathon tracking |
| **Extensions** | ✅ Complete | Chrome: Clipper, Harvester |

### Full Feature Set

Xandar-Lab is more comprehensive than a typical learning platform:

**Established Systems (>80% complete):**
- Authentication with NextAuth v5 + JWT + multi-device sessions
- Practice module with attempt history and tracking
- Job application tracking & notes
- User profiles with stats & avatar customization
- Community feed with posts & content sharing
- Chrome extensions for content capture (Clipper, Harvester)

**In Active Development (50-80% complete):**
- **Ideas Module**: LLM-powered idea generation with domain-specific signals
  - Web search integration (Tavily)
  - Market research analysis
  - Tech stack evaluation
  - Confidence scoring & batch processing
- **Interview Practice**: AI-powered interview simulation
  - Multiple interview styles (guided, realistic, pressure)
  - Real-time feedback with detailed scoring
  - Problem recommendations based on performance
- **Docs/Explanations**: Problem explanation system
  - Feedback collection (clarity, completeness, conciseness)
  - Linked to practice problems
  - Editable explanations with versioning
- **Community Features**: Sharing & collaboration
  - Posts with polymorphic content (interviews, problems, notes, hackathons)
  - Comments & discussion threads
  - Vote/engagement tracking

**In Development (UI scaffolded, features pending):**
- Notes module (markdown-based with tagging)
- Experiments (code sandbox & playgrounds)
- Hackathons (event tracking & project portfolio)

**Infrastructure:**
- LangChain + OpenAI LLM pipelines for idea synthesis
- Adaptive difficulty tracking & recommendations
- Activity logging system for analytics
- Monorepo setup (main app + Chrome extensions)

### Authentication System

**Implementation Details:**
- NextAuth v5 with JWT using `jose` library
- Password hashing with `bcryptjs`
- Session management with device tracking
- Cookie-based token persistence

**Features:**
- User registration with username/password
- Secure login w/ JWT tokens (7-day expiry)
- Multi-device session tracking & management
- Individual or bulk session termination
- Password change with validation
- Account deletion with data cleanup

### Practice Module

**Purpose:** Curated DSA problem tracking with learning evolution preserved through attempt history.

**Features:**
- Topic-organized problem sheets
- Problem canvas with grid view
- Detailed drawer with problem info & links
- Attempt-based learning model (Attempting → Resolved)
- Saved vs completed problem tracking
- Attempt history & lineage

**Components:**
- `TopicSidebar` — Topic navigation
- `ProblemCanvas` — Problem grid
- `ProblemDrawer` — Details & attempt history
- `AttemptHistory` — Version lineage

### Jobs Module

**Purpose:** Centralized job & internship application tracking.

**Features:**
- Curated job listings by category
- Application status tracking
- Save jobs for later
- Personal notes per job
- Job details drawer with links

**Components:**
- `JobsCanvas` — Jobs grid
- `JobDrawer` — Details & notes panel
- `StatusTracker` — Application progress

### Profile System

**Purpose:** Centralized user settings, stats, and preferences.

**Features:**
- Profile information editing (username, email, bio)
- Avatar customization with gradient colors
- Password management with validation
- Session management across devices
- Account deletion with data cleanup
- Stats display (saved/completed problems, interview scores)

**Tabs:**
- Profile — Basic info and avatar customization
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
│  Next.js 16.1.6 (App Router) + React 19.2 + TS 5      │
│  Tailwind CSS 4 + Framer Motion 12 + Radix UI         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
├─────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/*)                        │
│  NextAuth v5 + JWT with jose + bcryptjs               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Database                            │
├─────────────────────────────────────────────────────────┤
│  MongoDB with Mongoose 9 + LLM/Signal Processing       │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
xandar-lab/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── attempts/             # Practice attempts & history
│   │   ├── jobs/                 # Job status & tracking
│   │   ├── problems/             # Problem operations
│   │   ├── stats/                # User statistics
│   │   ├── ideas/                # Ideas module
│   │   ├── community/            # Community feed
│   │   ├── explanations/         # Explanation API
│   │   ├── interviews/           # Interview practice
│   │   ├── analytics/            # Activity analytics
│   │   ├── seed/                 # Database seeding
│   │   └── [other-modules]/      # Portals, suggestions, ingest
│   │
│   ├── lab/                      # Main lab workspace
│   │   ├── practice/             # 📊 DSA practice
│   │   ├── jobs/                 # 💼 Job tracking
│   │   ├── profile/              # 👤 User profile
│   │   ├── ideas/                # 💡 Ideas with forge
│   │   ├── community/            # 👥 Feed & sharing
│   │   ├── docs/                 # 📘 Explanations
│   │   ├── interviews/           # 🎙️ Interview prep
│   │   ├── notes/                # 📝 Personal notes
│   │   ├── experiments/          # 🧪 Code sandbox
│   │   └── hackathons/           # 🏆 Hackathons
│   │
│   ├── community/                # Public community page
│   └── page.tsx                  # Landing page
│
├── components/                   # Shared components
│   ├── auth/                    # Authentication UI
│   ├── theme/                   # Theme switching
│   └── ui/                      # Radix-based primitives
│
├── models/                       # MongoDB schemas
│   ├── User.ts                  # User profile
│   ├── Attempt.ts               # Problem attempts
│   ├── Idea.ts                  # Ideas with signals
│   ├── Explanation.ts           # Explanation feedback
│   ├── Post.ts                  # Community posts
│   ├── InterviewSession.ts      # Interview metrics
│   ├── Comment.ts               # Discussions
│   ├── ActivityLog.ts           # User activity
│   └── [other models]/          # PipelineRun, SignalCache, etc.
│
├── lib/                          # Utilities
│   ├── db.ts                    # MongoDB connection
│   ├── auth.ts                  # Auth helpers
│   ├── ideas/                   # Idea processing
│   │   ├── llm.ts              # LLM integration
│   │   ├── pipeline.ts         # Signal pipeline
│   │   ├── tavily.ts           # Web search
│   │   └── [signal modules]/   # dedup, domainQueries, etc.
│   └── utils.ts                 # Helper functions
│
├── extensions/                   # Chrome extensions (monorepo)
│   ├── clipper/                 # Web clipper
│   └── harvester/               # Content harvester
│
└── types/                        # TypeScript definitions
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

### Near-Term Goals (Phase 2 — In Progress)

1. **Ideas Module Maturation**
   - Refine signal scoring algorithm
   - Multi-source validation
   - User feedback loop for idea ranking
   - Idea versioning & iteration tracking

2. **Interview Module Enhancement**
   - Expand interview question bank
   - Improve scoring algorithm
   - Add behavioral interview prep
   - Track interview performance trends

3. **Notes & Knowledge Graph**
   - Markdown-based note-taking
   - Bi-directional linking
   - Cross-module note references
   - Full-text search across notes

### Medium-Term Goals (Phase 3)

1. **Advanced Analytics**
   - Learning velocity tracking
   - Problem mastery scoring
   - Time-to-competency predictions
   - Personalized recommendation engine

2. **Collaborative Features**
   - Shared study groups
   - Group problem-solving sessions
   - Peer code review
   - Discussion threads

3. **Data Portability**
   - Export learning history
   - Import problems from external sources
   - Backup/restore functionality

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
