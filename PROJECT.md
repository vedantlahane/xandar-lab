# Xandar-Lab: Project Documentation

> **Last Updated:** October 2026

This document is the canonical technical reference for Xandar-Lab — covering vision, architecture, every module, the full data model, the AI pipeline internals, and future direction. It is generated directly from the source code.

---

## Table of Contents

1. [Vision & Philosophy](#1-vision--philosophy)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Project Structure](#4-project-structure)
5. [Authentication & Access Control](#5-authentication--access-control)
6. [Module Breakdown](#6-module-breakdown)
7. [Data Models (Schema Reference)](#7-data-models-schema-reference)
8. [API Routes](#8-api-routes)
9. [Library Internals](#9-library-internals)
10. [Database Layer](#10-database-layer)
11. [Environment Variables](#11-environment-variables)
12. [Scripts & Seeding](#12-scripts--seeding)
13. [Future Vision](#13-future-vision)

---

## 1. Vision & Philosophy

### What is Xandar-Lab?

Xandar-Lab is a **modular, lab-style learning workspace** for developers who take learning seriously. It is not a course platform, not a problem-grinding site, and not a note-dump. It is an integrated environment that treats learning like version control for understanding — every iteration is preserved, every context is linked.

### The Problem With Existing Tools

| Pain Point | Typical Approach | Xandar-Lab |
|------------|-----------------|------------|
| Fragmented tools | Notes in Notion, practice on LeetCode, jobs in a spreadsheet | All in one workspace |
| Binary progress | Solved / Unsolved | Full attempt lineage with code, complexity, duration |
| Gamification pressure | Streaks, badges, leaderboards | Calm, process-first design |
| Context loss | Each tool is a silo | Cross-module references (Attempt -> Idea -> Note) |
| AI as a shortcut | Copy-paste from ChatGPT | AI as a structured learning partner |

### Design Principles

1. **Process over Performance** - Track *how* you learn, not just *what* you complete.
2. **Understanding over Outcomes** - Capture intuition, reflections, and failure reasons alongside answers.
3. **Calm over Gamified** - Zero dopamine hooks. No streaks, no badges.
4. **Labs over Dashboards** - A workspace for exploration, not a progress tracker.

### The Lab Metaphor

- Scientists keep lab notebooks - you keep attempt histories.
- Experiments can fail and that is data - failure reasons are first-class fields.
- Results reference the process - interview scorecards link back to the specific attempt.
- Collaboration is structured - discussions are tied to specific contexts, not a noisy global feed.

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | ^16.1.6 | Full-stack React with SSR and API routes |
| **Language** | TypeScript | ^5 | Type safety across frontend, backend, and models |
| **Styling** | Tailwind CSS | ^4 | Utility-first CSS with custom design tokens |
| **Animations** | Framer Motion | ^12.23.26 | Spring physics, stagger, layout animations |
| **Rich Text** | Tiptap | ^3.31.3 | Extensible ProseMirror editor (notes, docs) |
| **Math Rendering** | KaTeX | ^0.18.9 | LaTeX math via tiptap-math-extension |
| **Code Highlighting** | highlight.js + lowlight | ^11 / ^3 | Syntax highlighting in code blocks |
| **Diagrams** | Mermaid | ^12.0.0 | Flowcharts and sequence diagrams in notes |
| **Database** | MongoDB + Mongoose | ^7.6 / ^9.10 | Primary data store with typed schemas |
| **Auth** | NextAuth v5 | ^5.0.0-beta.30 | Session management (JWT strategy) |
| **JWT** | jose | ^6.1.3 | Low-level JWT signing and verification |
| **Password Hashing** | bcryptjs | ^3.0.3 | Credential-based auth |
| **Email** | Nodemailer | ^7.0.13 | SMTP email for notifications |
| **AI - LLM** | LangChain + @langchain/openai | ^1.1 / ^1.4 | LLM invocations and prompt chaining |
| **AI - Graph** | LangGraph | ^1.2.6 | Multi-agent stateful graph for Idea Forge |
| **AI - Search** | Tavily | via tavily.ts | Real-time web signals for idea generation |
| **Validation** | Zod | ^4.3.6 | Runtime schema validation |
| **UI Primitives** | Radix UI | ^1.6.7 | Accessible headless components |
| **Icons** | Lucide React | ^0.562.0 | Consistent icon system |
| **Emoji** | emoji-mart | ^5.6.0 | Emoji picker in notes/editor |
| **Extensions** | Plasmo | latest | Chrome extension framework |

---

## 3. Architecture Overview

```
Browser / Chrome Extensions
      |
      | HTTP / fetch
      v
API Layer (app/api/*)
  - NextAuth v5 (JWT, Google OAuth, credentials)
  - RBAC middleware (lib/rbac.ts)
  - Nodemailer (SMTP)
  - Zod validation
      |
      | Mongoose ODM
      v
MongoDB Atlas
  - 18 collections
  - TTL indexes (SignalCache, VoteLog)
  - Full-text indexes (Idea)
      |
      | OpenAI API + Tavily API
      v
AI / LLM Layer
  - LangGraph StateGraph (6-agent pipeline)
  - LangChain OpenAI (gpt-4o, structured output)
  - Tavily search (real-time domain signals)
  - SignalCache (MongoDB TTL, dedup)
```

### Routing Strategy

| Prefix | Access | Purpose |
|--------|--------|---------|
| `/` | Public | Landing page |
| `/lab/*` | Auth required | Core lab workspace |
| `/lab/u/[username]` | Public (if profile is public) | Shareable user profiles |
| `/community/*` | Auth required | Social feed (top-level route, not in /lab) |
| `/app/api/*` | Auth required | REST JSON API |


---

## 4. Project Structure

```
xandar-lab/
|-- app/
|   |-- api/
|   |   |-- admin/               # Admin-only utilities
|   |   |-- analytics/           # Usage analytics (in progress)
|   |   |-- attempts/            # Practice attempt CRUD + discussions
|   |   |-- auth/                # NextAuth handler + custom routes
|   |   |-- community/           # Community posts + comments
|   |   |-- docs/                # Document CRUD
|   |   |-- experiments/         # Experiment CRUD
|   |   |-- explanations/        # Problem explanation + AI feedback
|   |   |-- ideas/               # Idea CRUD, forge pipeline, catalog cron
|   |   |-- ingest/              # Extension ingestion endpoint
|   |   |-- interviews/          # AI interview session management
|   |   |-- jobs/                # Job listing + application tracking
|   |   |-- notebooks/           # Notebook CRUD
|   |   |-- notes/               # Note CRUD + sharing
|   |   |-- portals/             # Job portal management
|   |   |-- problems/            # DSA problem catalog
|   |   |-- seed/                # Protected seeder endpoints
|   |   |-- stats/               # User stats and dashboard data
|   |   |-- suggestions/         # Adaptive difficulty suggestions
|   |   |-- upload/              # File and asset uploads
|   |   `-- users/               # User management and profile updates
|   |-- community/               # Community pages (top-level route)
|   |   `-- feed/                # Community feed UI
|   |-- lab/                     # Core lab workspace (protected)
|   |   |-- components/          # Lab-specific shared components
|   |   |-- docs/                # Documents and explanations UI
|   |   |-- experiments/         # Experiments sandbox UI
|   |   |-- hackathons/          # Hackathons tracker UI
|   |   |-- ideas/               # Ideas forge and listing UI
|   |   |   |-- [slug]/          # Individual idea detail page
|   |   |   |-- forge/           # Live idea generation UI
|   |   |   `-- components/      # Ideas-specific components
|   |   |-- jobs/                # Jobs tracker UI
|   |   |   `-- portals/         # Portals management sub-route
|   |   |-- notes/               # Notes editor UI
|   |   |   `-- [id]/            # Individual note edit page
|   |   |-- practice/            # Practice module
|   |   |   |-- analyze/         # Performance analysis view
|   |   |   |-- focus/           # Problem focus/solve view
|   |   |   |-- interview/       # AI interview session
|   |   |   `-- components/      # Practice-specific components
|   |   |-- profile/             # User profile and settings
|   |   `-- u/[username]/        # Public user profile pages
|   |-- globals.css              # Global styles and Tailwind config
|   |-- layout.tsx               # Root layout (providers, fonts)
|   `-- page.tsx                 # Landing page
|
|-- components/
|   |-- auth/                    # AuthContext, login/signup forms
|   |-- shared/                  # Cross-module UI (Navbar, Sidebar, etc.)
|   |-- theme/                   # ThemeProvider, dark/light toggle
|   `-- ui/                      # Primitive components (Button, Dialog, etc.)
|
|-- lib/
|   |-- adaptiveDifficulty.ts    # Weighted difficulty calculation for interviews
|   |-- auth.ts                  # hashPassword, verifyPassword helpers
|   |-- db.ts                    # Mongoose connection with global cache
|   |-- mongodb.ts               # Low-level MongoDB client (for NextAuth adapter)
|   |-- rbac.ts                  # Role-based access control functions
|   |-- utils.ts                 # General-purpose utilities (cn, etc.)
|   |-- ideas/                   # Idea Forge pipeline system
|   |   |-- pipeline.ts          # LangGraph 6-agent StateGraph (1089 lines)
|   |   |-- scheduler.ts         # Batch scheduler across 14 domains
|   |   |-- prompts.ts           # System and user prompts for all 6 agents
|   |   |-- llm.ts               # OpenAI invocation wrapper with JSON parsing
|   |   |-- tavily.ts            # Tavily search API wrapper
|   |   |-- dedup.ts             # Idea de-duplication logic
|   |   |-- domainQueries.ts     # Curated Tavily queries per domain
|   |   |-- signalCache.ts       # MongoDB TTL cache for Tavily signals
|   |   |-- rateLimit.ts         # Request rate limiting
|   |   `-- types.ts             # Full TypeScript types for pipeline state
|   `-- services/
|       `-- AuthService.ts       # Server-side auth helper
|
|-- models/                      # Mongoose schema definitions (18 models)
|   |-- User.ts
|   |-- Problem.ts
|   |-- Attempt.ts               # Also exports Discussion model
|   |-- InterviewSession.ts
|   |-- Explanation.ts
|   |-- Idea.ts
|   |-- PipelineRun.ts
|   |-- VoteLog.ts
|   |-- SignalCache.ts
|   |-- Note.ts
|   |-- Notebook.ts
|   |-- Document.ts
|   |-- Experiment.ts
|   |-- ClippedJob.ts
|   |-- JobNote.ts
|   |-- Post.ts
|   |-- Comment.ts
|   `-- ActivityLog.ts
|
|-- types/
|   `-- next-auth.d.ts           # NextAuth session type augmentation
|
|-- scripts/
|   |-- seed-practice.ts         # DSA problem catalog seeder (31KB)
|   |-- seed-ideas.ts            # Idea collection seeder
|   |-- seed-db.ts               # Core database seed
|   |-- test-db.ts               # Database connection test
|   `-- check-nodes.js           # Node.js environment checker
|
|-- extensions/
|   |-- clipper/                 # Chrome Clipper (Plasmo framework)
|   `-- harvester/               # Chrome Harvester (Plasmo framework)
|
|-- auth.ts                      # NextAuth configuration
|-- next.config.ts               # Next.js config (redirects, optimizations)
`-- package.json                 # Root package with npm workspaces
```

---

## 5. Authentication & Access Control

### Providers (configured in auth.ts)

| Provider | Mechanism | Notes |
|----------|-----------|-------|
| **Google OAuth** | next-auth/providers/google | Auto-creates user on first login |
| **Credentials** | Username + password + bcryptjs | Supports sign-up and sign-in |
| **Nodemailer** | Magic link via SMTP | Email-based passwordless login |

**Invite-code gating:** New credential sign-ups require an invite code (env var `INVITE_CODE`, default `7447`).

### JWT Session Payload

| Field | Type | Source |
|-------|------|--------|
| `id` | string | MongoDB _id |
| `username` | string | User.username |
| `role` | UserRole | User.role |
| `avatarGradient` | string | Tailwind gradient class |

### Role Hierarchy (lib/rbac.ts)

```
user (1) < pro (2) < contributor (3) < moderator (4) < admin (5)
```

| Role | Key Permissions |
|------|----------------|
| `user` | Read public content, manage own resources |
| `pro` | Reserved for future feature gating |
| `contributor` | canPublishDirectly() - post to community without review |
| `moderator` | canEditResource(), canPinContent(), canRequestChanges() |
| `admin` | All above + canDeleteResource() any resource, canCurateContent() |

**Default admins** are hard-coded by username/email and promoted automatically on every login. Extra admins via `ADMIN_USERNAMES` and `ADMIN_EMAILS` env vars.

### Session Management

The `User` model stores an `ISession[]` array per device:
- `tokenId`, `userAgent`, `ip`, `createdAt`, `lastActiveAt`, `expiresAt`
- A `pre('save')` hook auto-purges expired sessions on every write.


---

## 6. Module Breakdown

### 6.1 Practice & Interviews

**Routes:** /lab/practice, /lab/practice/focus, /lab/practice/analyze, /lab/practice/interview

#### Practice Core

The Practice module treats DSA problems as long-term learning assets, not checkboxes.

**Attempt Lineage:** Every time a user works on a problem they create a new `Attempt` document - preserving code, time spent, complexity notes, and reflections. Historical attempts are never overwritten.

**Attempt Status States:**

| Status | Meaning |
|--------|---------|
| `attempting` | Work in progress |
| `resolved` | Solved independently |
| `solved_with_help` | Solved with hints or editorial |
| `gave_up` | Intentionally abandoned (stores failure reason) |

**Key Attempt Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `content` | string (5000 chars) | Approach/strategy notes |
| `code` | string (20000 chars) | Code snapshot |
| `language` | string | e.g. Python, JavaScript |
| `timeComplexity` / `spaceComplexity` | string | Self-annotated Big-O |
| `feltDifficulty` | number (0-5) | Subjective difficulty rating |
| `duration` | number | Time spent in seconds |
| `failureReason` / `failureNote` | string | For gave_up attempts |
| `solveMethod` | string | "Independently" / "With hints" / "From editorial" |
| `keyInsight` | string (1000 chars) | The critical realization |
| `confidence` | string | "Definitely" / "Probably" / "Not sure" |
| `source` | enum | "manual" or "interview" |
| `interviewSessionId` | ObjectId | Bridge from interview sessions |

**Discussions:** Each Attempt supports contextual `Discussion` comments for peer feedback on specific approaches.

**Problem Catalog:** Seeded via `scripts/seed-practice.ts`. Problems have `id`, `title`, `url`, `platform`, `tags`, and `topicName`.

#### AI Interview Simulator

**Route:** /lab/practice/interview | **API:** /api/interviews

The AI interviewer has access to the user's actual attempt (code, stated complexity, confidence). It conducts a mock technical interview based on that specific submission.

**Interview Styles:**

| Style | Hint Budget | Silence Threshold | Personality |
|-------|-------------|-------------------|-------------|
| `guided` | 5 hints | 120s | Patient, educational. For learners. |
| `realistic` | 3 hints | 300s | Balanced. Like a real FAANG interview. |
| `pressure` | 1 hint | 600s | Tough, interruptions, time pressure. |

**Session Lifecycle:** active -> (conversation) -> completed + IReport generated

**Report Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `overallScore` | number (0-10) | Overall performance score |
| `metrics[]` | {name, score}[] | Named scoring dimensions |
| `strengths[]` | string[] | What the candidate did well |
| `improvements[]` | string[] | Specific improvement suggestions |
| `suggestedProblemIds[]` | string[] | Follow-up problems from AI |

Sessions can be private, unlisted, or public (shared to community feed).

#### Adaptive Difficulty Engine (lib/adaptiveDifficulty.ts)

Uses a weighted moving average of the last 5 completed interview sessions:

```
Weights (oldest to newest): [0.10, 0.15, 0.20, 0.25, 0.30]
Performance mapping:  score >= 8 -> exceeded (+1)
                      score >= 5 -> met       ( 0)
                      score <  5 -> below     (-1)

Decision rules:
  weightedScore > 0.5  -> increase difficulty: min(5, current+1)
  weightedScore < -0.3 -> decrease difficulty: max(1, current-1)
  else                 -> hold current level

Difficulty labels:
  1 = Easy | 2 = Medium-Easy | 3 = Medium | 4 = Medium-Hard | 5 = Hard
```

No history? Default to level 2 (Medium-Easy).

---

### 6.2 Ideas Forge

**Routes:** /lab/ideas, /lab/ideas/forge, /lab/ideas/[slug]
**Library:** lib/ideas/

The Ideas Forge is a fully automated multi-agent LLM pipeline that generates, critiques, validates, and synthesizes startup ideas from live market signals.

#### 6-Agent LangGraph Pipeline

Defined in `lib/ideas/pipeline.ts` as a LangGraph `StateGraph`:

```
[START]
   |
   v
Scout Agent        -> Searches Tavily for pain points and market signals
   |
   v
Ideator Agent      -> Generates 3-5 raw ideas from signals + user preferences
   |
   v
Critic Agent       -> Reviews each idea. Verdict: KILL | REVISE | PROCEED
   |
   +-- (REVISE/KILL + iterations < max) -> [back to Ideator]
   |
   v
Market Check Agent -> Validates demand, maps competitors, scores market fit
   |
   v
Tech Review Agent  -> Assesses feasibility, suggests stack, defines MVP milestones
   |
   v
Synthesizer Agent  -> Merges analysis into final FinalIdea objects
   |
   v
[END]
```

**Pipeline Input:**

| Input | Type | Options |
|-------|------|---------|
| `domain` | string | e.g. "developer-tools", "fintech" |
| `skills` | string[] | User's tech skills |
| `preferences.timeline` | enum | "1 week" / "2-4 weeks" / "1-2 months" |
| `preferences.goal` | enum | "learn_portfolio" / "side_project" / "potential_startup" |
| `preferences.monetization` | enum | "not_important" / "nice_to_have" / "primary_goal" |

#### Signal Cache

Before each run, the Scout checks `SignalCache` for a fresh Tavily result for the same domain. If found (and not TTL-expired), reuses it. If not, fetches fresh signals and caches with new TTL.

#### De-duplication

Before saving, `lib/ideas/dedup.ts` normalizes title/keyword tokens and compares against existing ideas in the same domain. Duplicates are discarded.

#### Scheduled Catalog (lib/ideas/scheduler.ts)

Runs across 14 pre-defined domains:

```
developer-tools, fintech, healthtech, edtech, ai-ml-tools, devops,
e-commerce, productivity, open-source, saas, mobile-apps,
cybersecurity, data-engineering, automation
```

Triggered by the `/api/ideas/catalog` endpoint (protected by `CRON_SECRET`). Each domain runs sequentially with 5000ms delay to avoid API rate limits.

**PipelineRun audit trail records:**
- `status`: running / completed / failed
- `ideasGenerated` / `ideasSurvived` - raw counts
- `criticStats`: killed, revised, proceeded, killRate, maxIterationsHit
- `durationMs` - total wall time
- `deliberation` - full internal deliberation log

#### Key Idea Fields

| Field | Description |
|-------|-------------|
| `title` / `slug` | Display title and URL-safe unique identifier |
| `problem` / `solution` | Core problem statement and proposed solution |
| `targetUser` | Who this is for |
| `whyNow` | Market timing rationale |
| `confidence` | 0-100 viability score |
| `complexity` | low / medium / high |
| `timeline` | Estimated build time |
| `techStack[]` | AI-suggested technologies |
| `monetization` / `risks` | Business model and risk analysis |
| `evidence[]` | Source URLs + snippets from Tavily |
| `marketData` | Raw Market Check agent output |
| `techReview` | Raw Tech Review agent output |
| `isPinned` / `isCurated` | Moderation flags |
| `status` | published / draft / archived / flagged |

Full-text search indexed on title (10x), tags (8x), problem (5x), solution (3x), targetUser (2x).

#### VoteLog

Upvotes and bookmarks stored in `VoteLog` with unique compound index `(ideaSlug, voterKey, voteType)` - one vote per user per type. Auto-expires after **90 days**.

---

### 6.3 Jobs & Portals

**Routes:** /lab/jobs, /lab/jobs/portals
**Models:** ClippedJob, JobNote

**Application Lifecycle:**

```
Scouted -> Applied -> OA -> Interviewing -> Offer -> Accepted / Rejected
```

Tracked via `User.jobApplications` (Map: jobId -> status string).

**Harvester Integration:** The Harvester Chrome extension monitors job pages. When a listing is captured, a full `IPageContext` is scraped and POSTed to `/api/ingest`:

| Context Field | Description |
|--------------|-------------|
| `pageTitle` | Browser tab title |
| `metaTags` | OpenGraph, description meta tags |
| `jsonLd[]` | JSON-LD structured data (often has role/salary data) |
| `mainHtml` | Trimmed main content HTML |
| `plainText` | Full page plaintext |

**Capture actions:** `"capture"` (manual save) or `"apply"` (auto-detected application click).

`ClippedJob` indexes on `(sourceUrl, username)` for deduplication.

**Job Notes (`JobNote`):** Notes scoped to a specific jobId + username. Compound index `(jobId, username)` for efficient per-job lookup.

---

### 6.4 Community & Feed

**Routes:** /community/feed
**Models:** Post, Comment, ActivityLog

> Community is a top-level route at /app/community/ - separate from /lab.

**Polymorphic Posts:** A Post wraps any shareable content type:

| sharedItemType | Content Wrapped |
|---------------|----------------|
| `InterviewSession` | A completed AI mock interview |
| `Problem` | A DSA problem being highlighted |
| `Note` | A public note shared to the feed |
| `HackathonResult` | A hackathon project |
| `Idea` | An idea from the Forge |

Pre-save guard: sharedItemId is required when sharedItemType is set.

**ActivityLog:** Per-user, per-day documents (YYYY-MM-DD). Unique compound index `(userId, date)` - one doc per user per day, upserted on every practice session.

| Field | Description |
|-------|-------------|
| `problemsCompleted[]` | Problem IDs solved that day |
| `problemsAttempted[]` | All problem IDs touched |
| `totalDuration` | Seconds spent practicing |
| `attemptsCount` | Number of attempt records created |

**Community RBAC:**

| Function | Min Role | Purpose |
|----------|----------|---------|
| `canPublishDirectly()` | contributor | Post without review |
| `canPinContent()` | moderator | Pin posts |
| `canCurateContent()` | admin | Mark as "Curated by Xandar" |
| `canRequestChanges()` | moderator | Request edits from authors |

---

### 6.5 Notes & Notebooks

**Routes:** /lab/notes, /lab/notes/[id]
**Models:** Note, Notebook

**Key Note Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Tiptap JSON/HTML |
| `category` | enum | Learning / Ideas / Todo / Reference / Personal / Work |
| `notebookId` | ObjectId | Parent notebook |
| `color` | enum | default / yellow / green / blue / purple / pink / orange |
| `tags[]` | string[] | Free-form tags |
| `visibility` | enum | private / public / shared |
| `sharedWith[]` | array | Per-user viewer/editor permissions |
| `revisions[]` | array | Full content history on each save |
| `isPinned` | boolean | Pinned to top of list |
| `isCurated` | boolean | Admin-curated public note |
| `changeRequests[]` | array | Moderation revision requests |
| `dueDate` | Date | Optional deadline |
| `parentId` | ObjectId | Sub-note (nested notes) |
| `isDeleted` | boolean | Soft delete flag |

**Notebooks** are lightweight hierarchical containers (name, icon, color, parentId for nested trees).

**Tiptap Extensions in Use:**

| Extension | Feature |
|-----------|---------|
| StarterKit | Bold, italic, headings, lists, blockquote, code |
| CodeBlockLowlight | Syntax-highlighted code (highlight.js) |
| tiptap-math-extension | Inline + block LaTeX via KaTeX |
| Image + ResizeImage | Drag-resizable images |
| Table (+ Row/Cell/Header) | Full table support |
| TaskList + TaskItem | Checkbox to-do lists |
| TextAlign | Left/center/right/justify |
| Highlight + Color | Text highlighting and coloring |
| Link | Hyperlinks |
| Subscript / Superscript | Math notation |
| Youtube | Embedded YouTube videos |
| Mention | @mention support |
| BubbleMenu + FloatingMenu | Context-sensitive toolbars |
| CharacterCount | Word/character stats |
| GlobalDragHandle | Block-level drag-and-drop |
| TableOfContents | Auto-generated TOC |
| FontFamily | Font switching |

Markdown interop via `tiptap-markdown` + `turndown` + `turndown-plugin-gfm`.

---

### 6.6 Documents

**Routes:** /lab/docs
**Models:** Document, Explanation

**Document** is the formal write-up counterpart to Note:
- Hierarchical (`parentId` -> Document) for wiki-style trees
- `revisions[]` - Full content history
- `isCurated` - Admin-featured content
- `sharedWith[]` - Per-user viewer/editor access

**Explanation** links a user's DSA problem write-up to AI feedback:

| Feedback Field | Description |
|---------------|-------------|
| `clarity` | 0-10 - How clear the explanation is |
| `completeness` | 0-10 - How thorough the coverage is |
| `conciseness` | 0-10 - How concise it is |
| `good` | What was explained well |
| `missing` | What was unclear or missing |

Unique index `(problemId, userId)` - one explanation per user per problem, updated in place.

---

### 6.7 Experiments

**Routes:** /lab/experiments
**Model:** Experiment

Experiments are metadata-rich sandbox records (not raw code files):

| Field | Type | Description |
|-------|------|-------------|
| `type` | enum | Frontend / Backend / Full Stack / AI/ML / Mobile / DevOps |
| `status` | enum | Active / Completed / Archived / Planning |
| `techStack[]` | string[] | Technologies used |
| `highlights[]` | string[] | Key learnings / outcomes |
| `parameters` | Map | Key-value experiment variables |
| `metrics` | Map | Key-value measured outcomes |
| `githubUrl` / `liveUrl` | string | External links |
| `visibility` | enum | private / public / shared |
| `changeRequests[]` | array | Moderation requests |
| `isPinned` / `isCurated` | boolean | Display flags |

---

### 6.8 Hackathons

**Routes:** /lab/hackathons

Hackathons are tracked as project timelines. Results can be shared to the community feed as `HackathonResult` typed posts.

---

### 6.9 Profile & Public Profiles

**Routes:** /lab/profile, /lab/u/[username]
**API:** /api/users, /api/stats

**User Profile Fields:**

| Field | Description |
|-------|-------------|
| `username` | 3-20 chars, unique, trimmed |
| `bio` | Up to 200 characters |
| `avatarGradient` | Tailwind gradient class (e.g. "from-blue-500 to-cyan-500") |
| `githubUrl` / `websiteUrl` / `twitterHandle` | Social links |
| `isProfilePublic` | Controls visibility of /lab/u/[username] |
| `followers[]` / `following[]` | Social graph (User ObjectId refs) |
| `reputationScore` | Community reputation counter |
| `savedProblems[]` / `completedProblems[]` | Problem tracking |
| `savedJobs[]` / `jobApplications` | Job tracking (Map: jobId -> status) |
| `sharingPreferences` | Auto-share toggles for problems and hackathons |

**Stats API (/api/stats)** aggregates: total attempts, resolved count, time spent, topic breakdown, activity history from ActivityLog.

---

### 6.10 Browser Extensions

Both extensions use Plasmo and are npm workspace packages.

**Clipper (extensions/clipper/)** - Capture any web content into the lab:

| Component | Role |
|-----------|------|
| popup.tsx | Quick-save UI with title, tags, destination |
| content.ts | Injected into pages - scrapes DOM |
| background.ts | Service worker - API calls to /api/ingest |
| options.tsx | Extension settings (API URL, auth token) |

**Harvester (extensions/harvester/)** - Specialized for job listings:

| Component | Role |
|-----------|------|
| background.ts (14KB) | Job scraping - listens for navigation on known portals |
| content.ts | Extracts JSON-LD, meta tags, main content HTML |
| popup.tsx | Manual save + status display |
| options.tsx | Portal configuration, auth setup |

Auto-capture flow: Visit job listing -> Harvester detects portal URL pattern -> scrapes IPageContext -> POSTs to /api/ingest with action: "apply".


---

## 7. Data Models (Schema Reference)

### Complete Model Index

| Model | Collection | Key Indexes | Notes |
|-------|-----------|-------------|-------|
| `User` | users | username (unique), email (sparse unique) | pre('save') purges expired sessions |
| `Problem` | problems | id (unique) | Seeded from scripts/seed-practice.ts |
| `Attempt` | attempts | (userId, timestamp), (problemId, userId) | Also exports Discussion model |
| `InterviewSession` | interviewsessions | (userId, startedAt) | Embeds messages[], report sub-doc |
| `Explanation` | explanations | (problemId, userId) unique | One per user per problem |
| `Idea` | ideas | Full-text on title/problem/solution/tags | Weighted search, domain/confidence indexes |
| `PipelineRun` | pipeline_runs | (status, createdAt) | No __v field |
| `VoteLog` | voteLogs | (ideaSlug, voterKey, voteType) unique | 90-day TTL auto-expiry |
| `SignalCache` | signalCache | domain (unique) | TTL expiry via expiresAt field |
| `Note` | notes | (authorId, visibility, createdAt), full-text | Soft-delete, revisions, change requests |
| `Notebook` | notebooks | authorId, parentId | Hierarchical via parentId |
| `Document` | documents | (authorId, visibility, createdAt) | Hierarchical via parentId |
| `Experiment` | experiments | (visibility, createdAt), (authorId, visibility) | Parameters + metrics as Maps |
| `ClippedJob` | clippedjobs | (sourceUrl, username) | Full IPageContext for future LLM extraction |
| `JobNote` | jobnotes | (jobId, username) | Job-scoped notes |
| `Post` | posts | authorId | Polymorphic - pre-save guard on sharedItemId |
| `Comment` | comments | (noteId, createdAt) | Threaded on Notes |
| `ActivityLog` | activitylogs | (userId, date) unique | Daily aggregation, upsert pattern |

### Model Relationships

```
User
  |-- Attempt[] (1:N) ---- Problem (N:1)
  |     `-- Discussion[] (1:N)
  |-- InterviewSession[] (1:N) ---- Attempt (optional back-link)
  |-- Explanation[] (1:N) ---- Problem (N:1)
  |-- Note[] (1:N) ---- Notebook (N:1, optional)
  |     `-- Comment[] (1:N)
  |-- Document[] (1:N)
  |-- Experiment[] (1:N)
  |-- ClippedJob[] (1:N)
  |-- Post[] (1:N) ---- {Note|Idea|InterviewSession|Problem|HackathonResult} (polymorphic)
  `-- ActivityLog[] (1:N, per-day)

Idea
  |-- VoteLog[] (1:N, 90-day TTL)
  `-- PipelineRun (N:1)

SignalCache (TTL-based, per domain, no direct FK)
```

---

## 8. API Routes

### Full Route Reference

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/users` | GET, POST | User listing and creation |
| `/api/users/[id]` | GET, PATCH, DELETE | Individual user management |
| `/api/stats` | GET | Aggregated user stats for dashboard |
| `/api/problems` | GET | DSA problem catalog listing |
| `/api/attempts` | GET, POST | Attempt creation and listing |
| `/api/attempts/[id]` | GET, PATCH, DELETE | Individual attempt management |
| `/api/interviews` | GET, POST | Interview session listing and creation |
| `/api/interviews/[id]` | GET, PATCH | Session state and updates |
| `/api/interviews/[id]/message` | POST | Send message in active session |
| `/api/interviews/[id]/end` | POST | Finalize session and generate report |
| `/api/suggestions` | GET | Adaptive difficulty suggestions |
| `/api/explanations` | GET, POST | Explanation CRUD |
| `/api/ideas` | GET, POST | Idea listing and manual creation |
| `/api/ideas/[slug]` | GET, PATCH, DELETE | Individual idea management |
| `/api/ideas/forge` | POST | Trigger live Idea Forge (streaming) |
| `/api/ideas/catalog` | POST | Cron batch generation (CRON_SECRET) |
| `/api/ideas/vote` | POST | Upvote / bookmark an idea |
| `/api/jobs` | GET, POST | Job listing and creation |
| `/api/jobs/[id]` | GET, PATCH, DELETE | Individual job management |
| `/api/portals` | GET, POST | Portal listing and creation |
| `/api/portals/[id]` | GET, PATCH, DELETE | Individual portal management |
| `/api/notes` | GET, POST | Note listing and creation |
| `/api/notes/[id]` | GET, PATCH, DELETE | Individual note management |
| `/api/notebooks` | GET, POST | Notebook listing and creation |
| `/api/notebooks/[id]` | GET, PATCH, DELETE | Individual notebook management |
| `/api/docs` | GET, POST | Document listing and creation |
| `/api/docs/[id]` | GET, PATCH, DELETE | Individual document management |
| `/api/experiments` | GET, POST | Experiment listing and creation |
| `/api/experiments/[id]` | GET, PATCH, DELETE | Individual experiment management |
| `/api/community` | GET, POST | Community post listing and creation |
| `/api/community/[id]` | GET, PATCH, DELETE | Individual post management |
| `/api/ingest` | POST | Extension ingestion (Clipper / Harvester) |
| `/api/upload` | POST | File and asset upload |
| `/api/analytics` | GET | Usage analytics (in progress) |
| `/api/admin` | GET | Admin utilities |
| `/api/seed` | POST | Protected database seeder |

---

## 9. Library Internals

### lib/db.ts - Database Connection

Uses a **global Mongoose connection cache** to avoid connection thrashing in serverless functions:
- `serverSelectionTimeoutMS: 5000`
- `connectTimeoutMS: 5000`
- `socketTimeoutMS: 10000`

Subsequent calls within the same process return the cached connection.

### lib/auth.ts - Auth Helpers

- `hashPassword(plain)` - bcrypt hash with default salt rounds
- `verifyPassword(plain, hashed)` - bcrypt compare

### lib/rbac.ts - Access Control

Pure functions, no DB calls, no side effects:

| Function | Signature | Description |
|----------|-----------|-------------|
| `hasMinimumRole()` | (userRole, requiredRole) -> boolean | Hierarchy check |
| `canEditResource()` | (userId, userRole, authorId) -> boolean | Author or moderator+ |
| `canDeleteResource()` | (userId, userRole, authorId) -> boolean | Author or admin only |
| `canPublishDirectly()` | (role) -> boolean | Contributor+ |
| `canPinContent()` | (role) -> boolean | Moderator+ |
| `canCurateContent()` | (role) -> boolean | Admin only |
| `isModeratorOrAdmin()` | (role) -> boolean | Moderator+ |
| `isAdmin()` | (role) -> boolean | Admin only |

### lib/adaptiveDifficulty.ts - Difficulty Engine

| Export | Description |
|--------|-------------|
| `calculateNextDifficulty(sessions[])` | Returns recommended difficulty 1-5 |
| `scoreToPerformance(score)` | Maps 0-10 score to exceeded/met/below |
| `performanceToAttemptStatus(perf)` | Maps performance to attempt status |
| `difficultyLabel(level)` | Returns "Easy" through "Hard" label |

### lib/ideas/ - Pipeline System

| File | Lines | Purpose |
|------|-------|---------|
| pipeline.ts | 1089 | LangGraph StateGraph - 6-agent system |
| scheduler.ts | 333 | Batch runner across 14 domains |
| prompts.ts | - | System + user prompts for all agents |
| llm.ts | - | invokeJsonModel() with structured output |
| tavily.ts | - | Tavily search API wrapper |
| dedup.ts | - | Token similarity deduplication |
| domainQueries.ts | - | Curated queries per domain |
| signalCache.ts | - | getCachedSignals / setCachedSignals |
| rateLimit.ts | - | API rate limiting |
| types.ts | 149 | ForgeState, FinalIdea, Signal, Critique, etc. |

---

## 10. Database Layer

### Connection

Primary: **MongoDB Atlas** (any MongoDB 6+ instance). Connection via `MONGODB_URI`.

### Index Strategy

| Collection | Index Type | Purpose |
|-----------|-----------|---------|
| ideas | Full-text (weighted) | Searchable idea catalog |
| voteLogs | TTL 90 days | Auto-purge old votes |
| signalCache | TTL via expiresAt | Auto-purge stale Tavily signals |
| activitylogs | Unique (userId, date) | One-doc-per-day upsert |
| attempts | Compound (userId, timestamp) | Recent attempts listing |
| interviewsessions | Compound (userId, startedAt) | Recent sessions listing |
| notes | (authorId, visibility, createdAt) + full-text | User notes + global search |

---

## 11. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Custom JWT signing secret |
| `AUTH_SECRET` | Yes | NextAuth session encryption secret |
| `AUTH_URL` | Yes | Base URL (e.g. http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `EMAIL_SERVER` | For email | SMTP connection string |
| `EMAIL_FROM` | For email | Sender email address |
| `OPENAI_API_KEY` | For AI features | OpenAI API key |
| `TAVILY_API_KEY` | For Ideas Forge | Tavily search API key |
| `IDEAFORGE_OPENAI_MODEL` | Optional | Model override (default: gpt-4o) |
| `CRON_SECRET` | For catalog cron | Protects /api/ideas/catalog endpoint |
| `INVITE_CODE` | Optional | Sign-up gate (default: 7447) |
| `ADMIN_USERNAMES` | Optional | Comma-separated extra admin usernames |
| `ADMIN_EMAILS` | Optional | Comma-separated extra admin emails |
| `DATABASE_URL` | Optional | Alias for MONGODB_URI (legacy) |

---

## 12. Scripts & Seeding

| Script | Description |
|--------|-------------|
| `scripts/seed-practice.ts` | Seeds the DSA problem catalog (~31KB of curated problems by topic) |
| `scripts/seed-ideas.ts` | Seeds initial idea documents |
| `scripts/seed-db.ts` | Core database seed (users, etc.) |
| `scripts/test-db.ts` | Tests MongoDB connection |
| `scripts/check-nodes.js` | Verifies Node.js environment |

The `/api/seed` endpoint provides a protected HTTP alternative for cloud deployments.

---

## 13. Future Vision

### Near-Term

1. **Inline Code Execution** - Run experiment code snippets in-browser (WASM sandbox or server-side runner).
2. **Analytics Dashboard** - Complete /api/analytics with visual charts: heatmaps, topic weakness radar, interview score trends.
3. **Cross-Module Linking** - Notes referencing Attempts, Ideas linking to Experiments, Interviews surfacing related Notes.
4. **LLM-Powered Notes** - AI summarization, tag suggestion, and related-content discovery.
5. **Structured Job Extraction** - Use stored IPageContext HTML from Harvester to auto-extract company/role/salary via LLM.

### Long-Term

1. **AI Curriculum** - Personalized learning paths from attempt history, activity logs, and interview performance.
2. **Collaborative Labs** - Shared workspaces with real-time co-editing of notes and experiments.
3. **Open Study Groups** - Community-organized groups around topics, with shared problem sets.
4. **Export/Import** - Full data portability: export all notes, attempts, ideas, experiments to JSON/Markdown.
5. **Mobile Companion** - Native mobile app or PWA for capturing ideas and reviewing notes on the go.

---

## Contributing

This project is currently in active development by [Vedant Lahane](https://github.com/vedantlahane).

---

*"Xandar-Lab treats learning like version control for understanding."*
