# Xandar-Lab: Project Documentation

> **Last Updated:** June 2026

This document provides a comprehensive overview of Xandar-Lab — its vision, current implementation status, architecture decisions, and future direction.

---

## 📖 Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Current Implementation](#current-implementation)
3. [Architecture Overview](#architecture-overview)
4. [Module Breakdown](#module-breakdown)
5. [Data Models](#data-models)
6. [Future Vision](#future-vision)

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
| **Interviews** | ✅ Complete | AI-powered interview practice & analysis |
| **Jobs** | ✅ Complete | Job/internship tracking, portals & notes |
| **Profile** | ✅ Complete | User settings, stats, avatar customization |
| **Ideas** | ✅ Complete | LLM-powered idea generator with domain signals |
| **Community** | ✅ Complete | Feed, posts, sharing, polymorphic content |
| **Docs** | ✅ Complete | Interactive documents and explanations |
| **Notes** | 🟢 Active | Markdown notes organized by group |
| **Experiments** | 🟢 Active | Code sandbox structures & categories |
| **Hackathons** | 🟢 Active | Hackathon timeline and project tracker |
| **Extensions** | ✅ Complete | Chrome: Clipper, Harvester |

### Full Feature Set

Xandar-Lab is a comprehensive learning platform, actively covering several workflows:

**Core Operations:**
- Authentication with NextAuth v5 + JWT + multi-device sessions
- Cross-module interaction within the unified App router (/lab/*) 

**Practice & Problem Solving:**
- Attempt-based lineage tracking
- Interleaved AI-powered interview simulator (/lab/practice/interview)

**Jobs & Portals:**
- Job applications tracker and specialized portals management
- Personal notes and specific status tracker per job

**Ideas Forge:**
- Deep LLM pipelines parsing signals (Tavily search, market evaluation)
- Idea visualization, vote logging, and confidence rating 
- Cron-based scheduling and auto-generation 

**Community & Interaction:**
- Activity logging and cross-pollinated community feed
- Post generation, commenting, and discussions 

**Storage & Capture:**
- Browser extensions syncing web problems and items directly into to the workspace

---

## 🏗️ Architecture Overview

### Tech Stack

`	ext
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
├─────────────────────────────────────────────────────────┤
│  Next.js (App Router) + React 19.2 + TypeScript 5       │
│  Tailwind CSS 4 + Framer Motion 12 + Radix UI           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
├─────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/*)                         │
│  NextAuth v5 + JWT with jose + bcryptjs                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Database                            │
├─────────────────────────────────────────────────────────┤
│  MongoDB with Mongoose 9 + LLM/Signal Processing        │
└─────────────────────────────────────────────────────────┘
`

### Directory Structure

`	ext
xandar-lab/
├── app/                          
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── attempts/             # Practice attempts & history
│   │   ├── jobs/                 # Job status & portals
│   │   ├── ideas/                # Idea pipelines, generation, & stats
│   │   ├── interviews/           # Simulation messages & scoring
│   │   ├── community/            # Community feed / posts
│   │   ├── explanations/         # Explanation data
│   │   └── stats/                # User dashboard info
│   ├── lab/                      # Main UI workspace
│   │   ├── practice/             # 📊 DSA practice (browse, focus, interview)
│   │   ├── jobs/                 # 💼 Job tracking
│   │   ├── ideas/                # 💡 Ideas forge and pipelines
│   │   ├── community/            # 👥 Feed & sharing
│   │   ├── notes/                # 📝 Personal notes
│   │   ├── docs/                 # 📘 Explanations
│   │   ├── experiments/          # 🧪 Code sandbox
│   │   └── hackathons/           # 🏆 Hackathons
│   └── page.tsx                  # Landing page
├── components/                   # Shared React Contexts & UI Primitives
├── models/                       # MongoDB schemas (User, Idea, Post, Attempt)
├── lib/                          # Utils & Idea parsing strategies (LLM wrappers)
└── extensions/                   # Dedicated local extensions (Clipper, Harvester)
`

---

## 🧩 Module Breakdown

Xandar-Lab is composed of several independent but interconnected modules:

### 1. Practice & Interviews (`/lab/practice`)
- **Attempts Tracking:** Instead of treating problems as binary "solved/unsolved", users record incremental attempts, tracking code versions, time taken, and complexity reflections.
- **AI Interview Simulator:** An LLM-powered chatbot interface that references the user's specific attempt to conduct a mock interview, asking edge-case questions and demanding complexity analysis.
- **Adaptive Difficulty:** System logic that suggests optimal subsequent problems based on historical performance gaps.

### 2. Jobs & Portals (`/lab/jobs`)
- **Application Pipeline:** Tracking job application lifecycles from 'Scouted' to 'Interviewing' and 'Resolved'.
- **Company Portals:** Managing standard application portals (e.g., Workday, Greenhouse) alongside localized credentials.
- **Contextual Notes:** Note-taking strictly tied to specific roles and companies to keep interview prep highly organized.

### 3. Ideas Forge (`/lab/ideas`)
- **LLM Pipelines:** Scheduled content generation and brainstorming using multi-step pipelines (LLM prompts, Tavily search aggregation, market signals).
- **De-duplication & Signal Cache:** Automatically identifies similar concepts and caches domain signals to prevent redundant generation.
- **Confidence Rating:** Evaluates the viability of an idea based on competitive analysis and market research.

### 4. Community & Feed (`/lab/community`)
- **Activity Sharing:** Polymorphic posts acting as a feed for sharing an 'Attempt', an 'Idea', or generic 'Notes'.
- **Contextual Discussions:** Threaded comment models allowing targeted feedback on specific problem attempts rather than general chatter.

### 5. Notes, Docs & Sandbox (`/lab/notes`, `/lab/docs`, `/lab/experiments`)
- **Notes:** Flexible Markdown knowledge base structured via tags and groups.
- **Experiments:** Isolated code sandboxes designed to test small learning hypotheses (e.g., prototype a specific hook or algorithm).
- **Hackathons:** Timeline tracking and project management for weekend builds.

### 6. Browser Integration (`/extensions`)
- **Clipper:** Chrome extension to instantly save problems, documentation fragments, or inspirations into the lab.
- **Harvester:** Specialized job scraping extension for importing external listings directly into the workspace's job pipeline.

---

## 📊 Data Models

Xandar-Lab utilizes rich relationships in MongoDB. Key collections and their primary responsibilities include:

- **User**: Core identity management, tracking authentication state, avatar customization details, and references to bookmarked modules.
- **Problem & Attempt**: 
  - `Problem`: Master list of DSA problems.
  - `Attempt`: Iterative states (e.g., `attempting`, `resolved`, `optimal`) of a user trying to solve a problem. Contains code snippets, time spent, and space/time complexity reflections.
- **Idea & PipelineRun**:
  - `Idea`: Content payload containing descriptions, AI-generated structured analysis, upvote/downvote logs (`VoteLog`), and deduplication links.
  - `PipelineRun`: Audit trails of LLM executions, caching Tavily search signals and prompt metadata.
- **InterviewSession**: Stores active states of AI-driven technical interviews, holding chronological transcripts and parsed AI evaluations/scorecards.
- **Jobs & Portals**:
  - `ClippedJob`: Jobs harvested directly from browser extensions with deep-linked metadata.
  - `JobNote`: Linked notes specifically scoped to job applications.
- **Community (Post, Comment, ActivityLog)**: 
  - Enables polymorphic feeds. Operations emit structured `ActivityLog` documents which roll up into timeline `Post`s.

---

## 🔮 Future Vision

### Near-Term Goals 

1. **Enhance Notebooks & Experiments**
   - Solidify markdown-based note-taking integration.
   - Build out inline execution for code sandboxes.

2. **Advanced Analytics**
   - Correlate AI attempts with user competency scores.
   - Expand profile statistics with visual activity maps.

3. **Collaborative Data & Portability**
   - Deepen community interactions (sharing labs/environments).
   - Solidify backup/restore and raw data exports.

### Long-Term Vision

1. **AI-Assisted Learning**
   - Full timeline suggestions and personalized curriculum based on outcomes.
2. **Community Features**
   - Open source study groups, threaded code reviews on problems.
3. **Multi-platform Hooks**
   - Expanded mobile footprint or specialized desktop companion forms.

---

## 🤝 Contributing

This project is currently in active development by [Vedant Lahane](https://github.com/vedantlahane).

---

*"Xandar-Lab treats learning like version control for understanding."*
