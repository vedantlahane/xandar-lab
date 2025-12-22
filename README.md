
---

# Xandar-Lab 🧪

**Xandar-Lab** is a modular learning workspace for developers — designed as a *lab*, not a checklist.

It brings together **structured notes, interactive documentation, and contextual practice** into a single environment, helping learners focus on *how* they learn, not just *what* they complete.

This repository currently implements the **Practice module**, one of the core building blocks of the Xandar-Lab ecosystem.

---

## ✨ Why Xandar-Lab?

Most learning workflows today are fragmented:

* Notes live in Notion or Markdown
* Practice happens on external platforms
* Progress is reduced to *solved / unsolved*
* Collaboration is either noisy or absent

Xandar-Lab aims to solve this by providing a **lab-style learning system** where:

* Concepts, notes, and practice coexist
* Learning is treated as a process
* Progress reflects understanding over time
* Collaboration is intentional and distraction-free

---

## 🧠 Practice Module (Current Focus)

The **Practice module** allows learners to work through curated problem sets inside the lab.

### Key capabilities

* Topic-wise organization of problems
* Multiple problem states:

  * Todo
  * In Progress
  * Done
* Progress tracking at:

  * Topic level
  * Overall sheet level
* Search and filtering by status
* Local-first persistence (works offline)
* Designed to support future collaboration

> This module is **not meant to replace platforms like LeetCode or GFG**, but to act as a structured companion inside a larger learning system.

---

## 🏗️ Project Structure (High Level)

```
xandar-lab/
├── .next/                         # Build output (auto-generated)
├── app/
│   ├── (marketing)/               # Public-facing pages
│   │   ├── page.tsx               # Landing / intro
│   │   └── layout.tsx             # Marketing layout
│   │
│   ├── api/                       # API route handlers
│   │   ├── health/
│   │   │   └── route.ts
│   │   └── auth/                  # (future)
│   │       └── route.ts
│   │
│   ├── lab/                       # 🧪 Core learning workspace
│   │   ├── layout.tsx             # Lab shell (sidebar + header)
│   │   ├── page.tsx               # Lab home (modules overview)
│   │
│   │   ├── practice/              # 🎯 Practice Module (current)
│   │   │   ├── page.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── TopicSidebar.tsx
│   │   │   │   ├── ProblemList.tsx
│   │   │   │   ├── ProblemItem.tsx
│   │   │   │   ├── ProgressHeader.tsx
│   │   │   │   └── AttemptPanel.tsx
│   │   │   │
│   │   │   ├── data/
│   │   │   │   └── dsaSheet.ts     # Curated problems
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── usePracticeState.ts
│   │   │   │   ├── useScrollSync.ts
│   │   │   │   └── useFilters.ts
│   │   │   │
│   │   │   ├── types.ts            # Problem, Section, Status
│   │   │   ├── constants.ts
│   │   │   └── README.md           # Practice module docs
│   │   │
│   │   ├── docs/                  # 📘 Interactive Docs Module
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   ├── content/
│   │   │   └── README.md
│   │   │
│   │   ├── notes/                 # 📝 Notes & Reflections
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── README.md
│   │   │
│   │   ├── experiments/           # 🧪 Experiments & Sandboxes
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   └── README.md
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Entry / redirect
│
├── components/                    # Shared components
│   ├── ui/                        # Atomic UI components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── input.tsx
│   │   └── dropdown.tsx
│   │
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
│
├── lib/                           # Utilities & services
│   ├── utils.ts
│   ├── storage.ts                # localStorage helpers
│   ├── auth.ts                   # auth helpers (future)
│   └── constants.ts
│
├── styles/
│   └── tokens.css                # Design tokens (optional)
│
├── public/                        # Static assets
│
├── .gitignore
├── components.json               # shadcn/ui config
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md

```

The architecture is **module-first**, making it easy to extend Xandar-Lab with new learning capabilities over time.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm / yarn / pnpm / bun

### Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open
👉 **[http://localhost:3000](http://localhost:3000)**
to view the app in the browser.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **State Persistence:** localStorage (v1)
* **Future plans:** Auth, database, collaboration

---

## 🧭 Roadmap

### Phase 1 (Current)

* Practice module
* Local-first progress tracking
* Clean, distraction-free UI

### Phase 2

* Attempt logging per problem
* Notes & reflections per topic
* User authentication

### Phase 3

* Shared labs / workspaces
* Collaborative visibility
* Cross-module linking (notes ↔ practice)

---

## 🎯 Design Philosophy

* **Process over performance**
* **Calm over gamified**
* **Structured over scattered**
* **Labs over dashboards**

Xandar-Lab is built for **deep learning**, not dopamine loops.

---

## 📄 License

This project is currently under active development.
License details will be added once the core modules stabilize.

---

## 👋 Author

Built by **Vedant Lahane**
as an evolving learning system, not just a project.

---

