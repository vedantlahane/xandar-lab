# Xandar-Lab ??

**A modular learning workspace for developers — designed as a lab, not a checklist.**

Xandar-Lab brings together structured notes, interactive documentation, contextual practice, and career tracking into a single environment. It helps learners focus on *how understanding evolves*, not just what gets completed.

> Built for deep learning, not dopamine loops.

---

## ? Philosophy

| Principle | Meaning |
|-----------|---------|
| **Process over performance** | Focus on *how* you learn, not what you complete |
| **Understanding over outcomes** | Capture the evolution of thought, not just final answers |
| **Calm over gamified** | No streaks, badges, or competitive noise |
| **Labs over dashboards** | A workspace for exploration, not a checklist |

### The Problem We Solve

Most learning workflows are fragmented:
- Notes live in Notion or Markdown files
- Practice happens on external platforms
- Progress is reduced to **solved / unsolved**
- Collaboration is either noisy or absent

Xandar-Lab provides a unified lab-style learning system where concepts, notes, and practice coexist seamlessly.

---

## ?? Current Features

Xandar-Lab is actively developed and currently features several robust modules:

- **?? Authentication**: JWT + NextAuth v5, Google OAuth, multi-device sessions, avatar gradients, email via Nodemailer.
- **?? Practice & Interviews**: Topic-wise DSA problem tracking, attempt lineage, adaptive difficulty, and AI-powered realistic interview simulations.
- **?? Ideas Forge**: LLM-powered idea generation with Tavily domain signals, de-duplication, rating, and scheduled pipelines.
- **?? Jobs Tracking**: Curated job listings, application status, portals, and personal notes per role.
- **?? Docs & Explanations**: Interactive documentation with feedback metrics.
- **?? Notes & Experiments**: Rich Tiptap-based notes with math/code support, and code experiment sandboxes.
- **?? Hackathons**: Event tracking and project portfolio builder.
- **?? Community**: Social feed, polymorphic posts (Attempt / Idea / Note), comments, and activity logs.
- **?? Public Profiles**: Shareable user profile pages at `/lab/u/[username]`.
- **?? Extensions**: Chrome extensions (Clipper, Harvester) for capturing and syncing web content directly into the lab.

---

## ?? Project Structure

```
xandar-lab/
+-- app/
¦   +-- api/                     # Backend API Routes
¦   ¦   +-- auth/                # Authentication endpoints
¦   ¦   +-- attempts/            # Practice attempts & history
¦   ¦   +-- community/           # Community feed / posts
¦   ¦   +-- docs/                # Document CRUD
¦   ¦   +-- experiments/         # Experiment management
¦   ¦   +-- explanations/        # Explanation data
¦   ¦   +-- ideas/               # Idea pipelines, generation & stats
¦   ¦   +-- ingest/              # Extension ingestion endpoints
¦   ¦   +-- interviews/          # Simulation messages & scoring
¦   ¦   +-- jobs/                # Job status & portals
¦   ¦   +-- notes/               # Notes CRUD
¦   ¦   +-- notebooks/           # Notebook grouping
¦   ¦   +-- portals/             # Job portal management
¦   ¦   +-- problems/            # DSA problem catalog
¦   ¦   +-- stats/               # User dashboard info
¦   ¦   +-- suggestions/         # Adaptive difficulty suggestions
¦   ¦   +-- upload/              # File/asset uploads
¦   ¦   +-- users/               # User management
¦   ¦   +-- admin/               # Admin utilities
¦   ¦   +-- analytics/           # Analytics endpoints
¦   ¦   +-- seed/                # Database seeders
¦   +-- community/               # ?? Community (feed & posts)
¦   +-- lab/                     # Core lab workspace
¦   ¦   +-- practice/            # ?? DSA Practice & Interviews
¦   ¦   +-- jobs/                # ?? Job tracking & Portals
¦   ¦   +-- docs/                # ?? Interactive docs & Explanations
¦   ¦   +-- notes/               # ?? Notes & Reflections
¦   ¦   +-- experiments/         # ?? Sandboxes
¦   ¦   +-- hackathons/          # ?? Hackathons tracking
¦   ¦   +-- ideas/               # ?? AI Idea Forge
¦   ¦   +-- profile/             # ?? User Profile & Stats
¦   ¦   +-- u/[username]/        # ?? Public User Profiles
¦   +-- page.tsx                 # Landing page
+-- components/                  # Shared UI components & Auth
+-- lib/                         # Utilities (AI, Ideas pipeline, DB, RBAC, etc.)
+-- models/                      # MongoDB Database Schemas
+-- extensions/                  # Chrome Extensions (Clipper, Harvester)
+-- scripts/                     # Seeders & utility scripts
+-- types/                       # Global TypeScript type declarations
```

---

## ??? Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion 12+ |
| **Rich Text Editor** | Tiptap 3 (math, code, tables, drag-handle) |
| **Database** | MongoDB with Mongoose 9 |
| **Auth** | NextAuth v5 with JWT, bcryptjs & Google OAuth |
| **Email** | Nodemailer (SMTP) |
| **Icons** | Lucide React |
| **UI Primitives** | Radix UI |
| **AI Processing** | LangChain + LangGraph + OpenAI + Tavily |
| **Rendering** | KaTeX (math), Mermaid (diagrams), highlight.js (code) |

---

## ?? Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- OpenAI API key (for Ideas & Interviews)
- Tavily API key (for Idea domain signals)
- Google OAuth credentials (for social login)
- SMTP server credentials (for email)

### Installation

```bash
# Clone the repository
git clone https://github.com/vedantlahane/xandar-lab.git
cd xandar-lab

# Install dependencies (includes workspaces)
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `AUTH_SECRET` | NextAuth session secret |
| `AUTH_URL` | Base URL for NextAuth (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `EMAIL_SERVER` | SMTP connection string |
| `EMAIL_FROM` | Sender email address |
| `OPENAI_API_KEY` | OpenAI API key |
| `TAVILY_API_KEY` | Tavily search API key |
| `IDEAFORGE_OPENAI_MODEL` | Model to use (e.g. `gpt-4o`) |
| `CRON_SECRET` | Secret for protecting cron endpoints |

---

## ??? Roadmap & Status

### ? Completed & Active
- Authentication (NextAuth + JWT + Google OAuth, Profile & Sessions)
- Practice Module (Attempt Lineage, Canvas, Drawer, Adaptive Difficulty)
- Interviews Module (AI-driven feedback & simulations)
- Ideas Forge (End-to-end AI idea pipeline, de-duplication & rating)
- Jobs & Portals Tracking
- Community Feed (Polymorphic posts, comments & activity logs)
- Docs, Notes (Tiptap), Hackathons & Experiments
- Chrome Extensions (Clipper, Harvester)
- Public User Profiles (`/lab/u/[username]`)
- RBAC (Role-based access control)

### ?? Planned (Next Up)
- Real-time collaboration on shared labs
- Advanced analytics (engagement, learning velocity)
- Complete cross-module linking (Note ? Practice ? Idea)
- Data portability (Export/Import)
- Inline code execution in Experiments sandbox

---

## ?? License

This project is under active development.

---

## ?? Author

Built by [**Vedant Lahane**](https://github.com/vedantlahane)
as a long-term learning system — not just a project.

---

*Xandar-Lab treats learning like version control for understanding.*
