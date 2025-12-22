Xandar-Lab 🧪
Xandar-Lab is a modular learning workspace for developers — designed as a lab, not a checklist.

It brings together structured notes, interactive documentation, and contextual practice into a single environment, helping learners focus on how understanding evolves, not just what gets completed.

This repository currently implements the Practice module, one of the core building blocks of the Xandar-Lab ecosystem.

✨ Why Xandar-Lab?
Most learning workflows today are fragmented:

Notes live in Notion or Markdown

Practice happens on external platforms

Progress is reduced to solved / unsolved

Collaboration is either noisy or absent

Xandar-Lab addresses this by providing a lab-style learning system where:

Concepts, notes, and practice coexist

Learning is treated as a process, not a score

Understanding is captured in versions

Collaboration is intentional, contextual, and quiet

🧠 Practice Module (Current Focus)
The Practice module allows learners to work through curated problem sets inside the lab, while recording how their understanding changes over time.

Core ideas
Problems are explored through attempts

Each attempt captures intuition, not just final answers

Understanding evolves via discussion

Resolution is explicit and versioned

Multiple attempts are preserved, never overwritten

🧩 Practice Flow (High Level)
Select a problem from the curated sheet

Share intuition (text, pseudocode, explanation, or link)

An Attempting node is automatically created

Contextual discussion happens on the attempt

When understanding stabilizes, a Resolved version is shared

Re-visiting the problem creates a new attempt, not a rewrite

Xandar-Lab treats learning like version control for understanding.

Key Capabilities
Topic-wise organization of problems

Right-sidebar topic navigation (scroll-synced)

Problem drawer with collaborative context

Attempt-based learning model

Attempting

Resolved

Multiple attempts per user, preserved as history

Contextual discussions (not chat)

Discussion-driven resolution

Timestamped learning snapshots

Local-first persistence (works offline)

This module is not meant to replace platforms like LeetCode or GFG, but to act as a structured companion inside a larger learning system.

🤝 Collaboration Model (Planned & Partial)
The Practice module supports intentional collaboration, not real-time chat.

Each user has their own branch

Attempts form a learning tree

Discussions are attached to specific attempts

Resolution can reference the discussion that caused it

Branches can be:

Shared with selected friends

Hidden or filtered

Archived or deleted by their owner

Comments can be hidden without breaking learning history

Collaboration emphasizes clarity and lineage, not noise.

🏗️ Project Structure (High Level)
xandar-lab/
├── app/
│   ├── (marketing)/              # Landing & intro
│   ├── lab/                      # Core lab workspace
│   │   ├── practice/             # 🎯 Practice module
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   ├── hooks/
│   │   │   ├── types.ts
│   │   │   └── README.md
│   │   ├── docs/                 # 📘 Interactive docs (planned)
│   │   ├── notes/                # 📝 Notes & reflections (planned)
│   │   └── experiments/          # 🧪 Sandboxes (planned)
│   └── api/                      # API routes (future)
│
├── components/                   # Shared UI components
├── lib/                          # Utilities & storage helpers
├── styles/                       # Design tokens
├── public/
└── README.md
The architecture is module-first, allowing Xandar-Lab to evolve without coupling features together.

🚀 Getting Started
Prerequisites
Node.js 18+

npm / yarn / pnpm / bun

Install dependencies
npm install
# or
yarn
# or
pnpm install
Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open
👉 http://localhost:3000
to view the app in the browser.

🛠️ Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

Animations: Framer Motion

State Persistence: localStorage (v1)

Planned: Auth, database, collaboration APIs

🧭 Roadmap
Phase 1 (Current)
Practice module

Attempt-based learning model

Local-first persistence

Clean, distraction-free UI

Phase 2
Attempt lineage & history

Notes and reflections per topic

Authentication

Phase 3
Shared labs

Branch-level collaboration

Cross-module linking (notes ↔ practice ↔ docs)

🎯 Design Philosophy
Process over performance

Understanding over outcomes

Calm over gamified

Labs over dashboards

Xandar-Lab is built for deep learning, not dopamine loops.

📄 License
This project is under active development.
License details will be added once core modules stabilize.

👋 Author
Built by Vedant Lahane
as a long-term learning system — not just a project.