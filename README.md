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

### 🔐 Authentication System
- Secure user registration and login with JWT tokens
- Session management with multi-device support
- Profile customization with avatar gradients
- Password management and account settings

### 🧠 Practice Module
- Topic-wise organization of DSA problems
- Central problem canvas with interactive UI
- Problem drawer with contextual details
- Attempt-based learning model (Attempting → Resolved)
- Progress tracking per user

### 💼 Jobs Module
- Curated job and internship listings
- Job tracking with application status
- Save jobs for later
- Personal notes on applications

### 👤 Profile System
- Comprehensive user profile page
- Stats dashboard (saved problems, completed problems)
- Session management across devices
- Account settings and preferences

### 🎨 UI/UX
- Modern, minimal dark/light theme
- Smooth Framer Motion animations
- Mobile-responsive design
- Distraction-free interface

---

## 📂 Project Structure

```
xandar-lab/
├── app/
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── jobs/                # Job tracking endpoints
│   │   ├── attempts/            # Practice attempts
│   │   └── stats/               # User statistics
│   ├── lab/                     # Core lab workspace
│   │   ├── practice/            # 🎯 DSA Practice module
│   │   ├── jobs/                # 💼 Job tracking module
│   │   ├── docs/                # 📘 Interactive docs
│   │   ├── notes/               # 📝 Notes & reflections
│   │   ├── experiments/         # 🧪 Sandboxes
│   │   ├── hackathons/          # 🏆 Hackathon tracking
│   │   └── profile/             # 👤 User profile
│   └── page.tsx                 # Landing page
├── components/
│   ├── auth/                    # Authentication components
│   └── ui/                      # Shared UI components
├── models/                      # MongoDB schemas
├── lib/                         # Utilities & helpers
└── data/                        # Static data files
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT with jose + bcryptjs |
| **Icons** | Lucide React |

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/vedantlahane/xandar-lab.git
cd xandar-lab

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧭 Roadmap

### ✅ Phase 1 (Complete)
- [x] Practice module with DSA problems
- [x] Authentication system
- [x] User profiles and sessions
- [x] Jobs/internship tracking
- [x] Dark/light theme

### 🔄 Phase 2 (In Progress)
- [ ] Attempt lineage & version history
- [ ] Notes module implementation
- [ ] Docs module with interactive content
- [ ] Experiments sandbox

### 📋 Phase 3 (Planned)
- [ ] Shared labs & collaboration
- [ ] Cross-module linking (notes ↔ practice ↔ docs)
- [ ] Real-time collaboration features
- [ ] Export/import learning data

---

## 📄 License

This project is under active development.
License details will be added once core modules stabilize.

---

## 👋 Author

Built by [**Vedant Lahane**](https://github.com/vedantlahane)
as a long-term learning system — not just a project.

---

*Xandar-Lab treats learning like version control for understanding.*