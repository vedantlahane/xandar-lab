# Xandar-Lab 🧪

**A modular learning workspace for developers — designed as a lab, not a checklist.**

Xandar-Lab brings together structured notes, interactive documentation, contextual practice, and career tracking into a single environment. It helps learners focus on *how understanding evolves*, not just what gets completed.

> Built for deep learning, not dopamine loops.

---

## ✨ Philosophy

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

## 🚀 Current Features

Xandar-Lab is actively developed and currently features several robust modules:

- **🔐 Authentication**: JWT + NextAuth v5, multi-device sessions, avatar gradients.
- **🧠 Practice & Interviews**: Topic-wise DSA problem tracking, attempt lineage, and AI-powered realistic interview simulations.
- **💡 Ideas Forge**: LLM-powered idea generation with domain signals, rating, and pipelines.
- **💼 Jobs Tracking**: Curated job listings, application status, portals, and personal notes.
- **📘 Docs & Explanations**: Interactive documentation with feedback metrics.
- **📝 Notes & Experiments**: Markdown-based notes and code experiment sandboxes.
- **🏆 Hackathons**: Event tracking and project portfolio builder.
- **👥 Community**: Social feed, posts, and polymorphic content sharing.
- **🧩 Extensions**: Chrome extensions (Clipper, Harvester) for capturing and syncing web content right into the lab.

---

## 📂 Project Structure

`
xandar-lab/
├── app/
│   ├── api/                     # Backend API Routes (Auth, Ideas, Practice, etc.)
│   ├── lab/                     # Core lab workspace
│   │   ├── practice/            # 🎯 DSA Practice & Interviews
│   │   ├── jobs/                # 💼 Job tracking & Portals
│   │   ├── docs/                # 📘 Interactive docs & Explanations
│   │   ├── notes/               # 📝 Notes & Reflections
│   │   ├── experiments/         # 🧪 Sandboxes
│   │   ├── hackathons/          # 🏆 Hackathons tracking
│   │   ├── ideas/               # 💡 AI Idea Forge
│   │   ├── community/           # 👥 Community Feed
│   │   └── profile/             # 👤 User Profile & Stats
│   └── page.tsx                 # Landing page
├── components/                  # Shared UI components & Auth
├── lib/                         # Utilities (AI, Ideas pipeline, DB, etc.)
├── models/                      # MongoDB Database Schemas
├── extensions/                  # Chrome Extensions (Clipper, Harvester)
└── scripts/                     # Seeders & utility scripts
`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion 12+ |
| **Database** | MongoDB with Mongoose 9 |
| **Auth** | NextAuth v5 with JWT & bcryptjs |
| **Icons** | Lucide React |
| **AI Processing**| LangChain + OpenAI + Tavily |

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- OpenAI API key (for Ideas & Interviews)
- Tavily API key (for Idea signals)

### Installation

`ash
# Clone the repository
git clone https://github.com/vedantlahane/xandar-lab.git
cd xandar-lab

# Install dependencies (includes workspaces)
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with appropriate keys

# Run development server
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🗺️ Roadmap & Status

### ✅ Completed & Active
- Authentication (NextAuth + JWT, Profile & Sessions)
- Practice Module (Attempt Lineage, Canvas, Drawer)
- Interviews Module (AI-driven feedback & simulations)
- Ideas Forge (End-to-end AI idea pipeline & rating)
- Jobs & Portals Tracking
- Community Feed (Post sharing & Voting)
- Docs, Notes, Hackathons & Experiments 
- Chrome Extensions (Clipper, Harvester)

### 📋 Planned (Next Up)
- Real-time collaboration on shared labs
- Advanced analytics (engagement, learning velocity)
- Complete cross-module linking capability (e.g., Note ↔ Practice ↔ Idea)
- Data portability (Export/Import)

---

## 📄 License

This project is under active development.

---

## 👋 Author

Built by [**Vedant Lahane**](https://github.com/vedantlahane)
as a long-term learning system — not just a project.

---

*Xandar-Lab treats learning like version control for understanding.*
