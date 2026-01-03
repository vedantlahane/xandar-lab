export type NoteColor = 'default' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'orange';
export type NoteCategory = 'Learning' | 'Ideas' | 'Todo' | 'Reference' | 'Personal' | 'Work';

export interface Note {
    id: string;
    title: string;
    content: string;
    category: NoteCategory;
    color: NoteColor;
    tags?: string[];
    isPinned?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NoteGroup {
    groupName: string;
    notes: Note[];
}

export const NOTES: NoteGroup[] = [
    {
        groupName: "Pinned",
        notes: [
            {
                id: "note-pinned-1",
                title: "2025 Learning Goals",
                content: `## Q1 Goals
- Master TypeScript generics and utility types
- Complete System Design course
- Build 2 full-stack projects
- Contribute to 3 open source projects

## Q2 Goals
- Learn Rust basics
- Deep dive into Kubernetes
- Build an AI-powered project

## Key Focus Areas
- Performance optimization
- Testing best practices
- Documentation skills`,
                category: "Learning",
                color: "yellow",
                tags: ["Goals", "2025", "Career"],
                isPinned: true,
                createdAt: "2025-01-01",
                updatedAt: "2025-01-01"
            },
            {
                id: "note-pinned-2",
                title: "Interview Prep Checklist",
                content: `## DSA Topics
- [x] Arrays & Strings
- [x] Linked Lists
- [ ] Trees & Graphs
- [ ] Dynamic Programming
- [ ] Backtracking

## System Design
- [ ] URL Shortener
- [ ] Rate Limiter
- [ ] Chat System
- [ ] News Feed

## Behavioral
- Prepare STAR stories
- Review past projects
- Practice explaining technical decisions`,
                category: "Work",
                color: "purple",
                tags: ["Interview", "Prep", "Important"],
                isPinned: true,
                createdAt: "2024-12-15",
                updatedAt: "2025-01-02"
            }
        ]
    },
    {
        groupName: "Learning Notes",
        notes: [
            {
                id: "note-learn-1",
                title: "React Server Components",
                content: `## Key Concepts
- Run on the server, never re-render on client
- Can directly access backend resources
- Zero bundle size impact
- Can be async functions

## When to Use
- Data fetching
- Accessing backend directly
- Large dependencies
- Keeping secrets safe

## When NOT to Use
- Need interactivity (onClick, onChange)
- Need state or effects
- Browser-only APIs

## Pattern
\`\`\`jsx
// Server Component (default)
async function Page() {
  const data = await db.query();
  return <ClientComponent data={data} />;
}
\`\`\``,
                category: "Learning",
                color: "blue",
                tags: ["React", "RSC", "Next.js"],
                createdAt: "2024-11-20",
                updatedAt: "2024-12-10"
            },
            {
                id: "note-learn-2",
                title: "Database Indexing Strategies",
                content: `## Types of Indexes
1. **B-Tree** - Default, good for ranges
2. **Hash** - Exact lookups only
3. **GiST** - Geometric/text search
4. **GIN** - Arrays, full-text

## Best Practices
- Index columns in WHERE clauses
- Consider composite indexes for multi-column queries
- Watch out for over-indexing (slows writes)
- Analyze query plans regularly

## Query Plan Reading
- Seq Scan = full table scan (bad for large tables)
- Index Scan = using index (good)
- Index Only Scan = best case`,
                category: "Reference",
                color: "green",
                tags: ["Database", "PostgreSQL", "Performance"],
                createdAt: "2024-10-05",
                updatedAt: "2024-11-15"
            },
            {
                id: "note-learn-3",
                title: "Git Rebase vs Merge",
                content: `## Merge
- Creates merge commit
- Preserves full history
- Safe for shared branches
- History can be messy

## Rebase
- Rewrites commit history
- Creates linear history
- Cleaner but risky for shared branches
- Golden rule: never rebase public branches

## Interactive Rebase
\`\`\`bash
git rebase -i HEAD~3
# pick, squash, fixup, edit, drop
\`\`\`

## My Workflow
- Rebase feature branches before merging
- Never rebase after pushing to shared branch
- Use merge for main/develop integration`,
                category: "Reference",
                color: "orange",
                tags: ["Git", "Version Control", "Workflow"],
                createdAt: "2024-09-10",
                updatedAt: "2024-09-10"
            }
        ]
    },
    {
        groupName: "Project Ideas",
        notes: [
            {
                id: "note-idea-1",
                title: "Code Review AI Assistant",
                content: `## Concept
AI-powered tool that reviews PRs and provides:
- Code quality suggestions
- Bug detection
- Performance optimization tips
- Security vulnerability alerts

## Tech Stack Ideas
- GitHub/GitLab API integration
- OpenAI for analysis
- Custom rules engine
- Slack/Discord notifications

## MVP Features
1. PR summary generation
2. Line-by-line comments
3. Suggested fixes
4. Severity scoring

## Revenue Model
- Freemium (X reviews/month free)
- Team plans
- Enterprise self-hosted`,
                category: "Ideas",
                color: "pink",
                tags: ["AI", "Developer Tools", "SaaS"],
                createdAt: "2024-12-01",
                updatedAt: "2024-12-20"
            },
            {
                id: "note-idea-2",
                title: "Learning Path Generator",
                content: `## Problem
Developers struggle to know what to learn next and in what order

## Solution
AI-generated personalized learning paths based on:
- Current skill level
- Career goals
- Time availability
- Learning style preference

## Features
- Skill assessment quiz
- Curated resource links
- Progress tracking
- Community challenges
- Mentor matching

## Differentiators
- Not just video courses
- Mix of tutorials, projects, docs
- Spaced repetition for retention`,
                category: "Ideas",
                color: "yellow",
                tags: ["EdTech", "AI", "Product"],
                createdAt: "2024-11-15",
                updatedAt: "2024-12-05"
            },
            {
                id: "note-idea-3",
                title: "Dev Environment Manager",
                content: `## Pain Point
Setting up dev environment is time-consuming and inconsistent

## Solution
Cross-platform dev environment manager that:
- Installs all tools in one command
- Syncs settings across machines
- Manages multiple project configs
- Integrates with dotfiles

## Inspiration
- Homebrew + nix + devcontainers combined
- One config file per project
- Works on Mac, Linux, WSL

## Technical Approach
- Use Docker for isolation
- Cloud sync for settings
- Plugin system for tools`,
                category: "Ideas",
                color: "blue",
                tags: ["DevTools", "DX", "Open Source"],
                createdAt: "2024-10-20",
                updatedAt: "2024-11-01"
            }
        ]
    },
    {
        groupName: "Quick References",
        notes: [
            {
                id: "note-ref-1",
                title: "Common Regex Patterns",
                content: `## Email
\`\`\`
^[\\w.-]+@[\\w.-]+\\.\\w+$
\`\`\`

## URL
\`\`\`
https?:\\/\\/[\\w.-]+(:\\d+)?(\\/[\\w.-]*)*
\`\`\`

## Phone (US)
\`\`\`
^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$
\`\`\`

## Password (8+ chars, 1 upper, 1 lower, 1 digit)
\`\`\`
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$
\`\`\`

## UUID
\`\`\`
^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
\`\`\``,
                category: "Reference",
                color: "default",
                tags: ["Regex", "Patterns", "Quick Ref"],
                createdAt: "2024-08-01",
                updatedAt: "2024-08-01"
            },
            {
                id: "note-ref-2",
                title: "HTTP Status Codes",
                content: `## 2xx Success
- 200 OK
- 201 Created
- 204 No Content

## 3xx Redirect
- 301 Moved Permanently
- 302 Found (temp redirect)
- 304 Not Modified

## 4xx Client Error
- 400 Bad Request
- 401 Unauthorized (not authenticated)
- 403 Forbidden (not authorized)
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity
- 429 Too Many Requests

## 5xx Server Error
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout`,
                category: "Reference",
                color: "green",
                tags: ["HTTP", "API", "Quick Ref"],
                createdAt: "2024-07-15",
                updatedAt: "2024-07-15"
            },
            {
                id: "note-ref-3",
                title: "Keyboard Shortcuts - VSCode",
                content: `## General
- Cmd/Ctrl + Shift + P: Command Palette
- Cmd/Ctrl + P: Quick Open
- Cmd/Ctrl + B: Toggle Sidebar
- Cmd/Ctrl + J: Toggle Terminal

## Editing
- Cmd/Ctrl + D: Select next occurrence
- Cmd/Ctrl + Shift + L: Select all occurrences
- Alt + Up/Down: Move line
- Alt + Shift + Up/Down: Copy line
- Cmd/Ctrl + /: Toggle comment

## Navigation
- Cmd/Ctrl + G: Go to line
- Cmd/Ctrl + Shift + O: Go to symbol
- F12: Go to definition
- Cmd/Ctrl + Click: Go to definition

## Multi-cursor
- Alt + Click: Add cursor
- Cmd/Ctrl + Alt + Up/Down: Add cursor above/below`,
                category: "Reference",
                color: "purple",
                tags: ["VSCode", "Productivity", "Shortcuts"],
                createdAt: "2024-06-01",
                updatedAt: "2024-10-10"
            }
        ]
    },
    {
        groupName: "Todo & Tasks",
        notes: [
            {
                id: "note-todo-1",
                title: "This Week's Tasks",
                content: `## Monday
- [x] Review PR #234
- [x] Deploy staging
- [ ] Write tests for auth module

## Tuesday
- [ ] Team standup presentation
- [ ] Fix bug #123
- [ ] Update documentation

## Wednesday
- [ ] 1:1 with manager
- [ ] Code review session
- [ ] Performance profiling

## Thursday
- [ ] Feature flag implementation
- [ ] Security audit review

## Friday
- [ ] Sprint retrospective
- [ ] Plan next week
- [ ] Knowledge sharing session`,
                category: "Todo",
                color: "orange",
                tags: ["Weekly", "Tasks", "Planning"],
                createdAt: "2025-01-01",
                updatedAt: "2025-01-03"
            },
            {
                id: "note-todo-2",
                title: "Project Backlog",
                content: `## High Priority
- [ ] Implement caching layer
- [ ] Add error boundaries
- [ ] Set up monitoring alerts

## Medium Priority
- [ ] Refactor user service
- [ ] Add unit tests (80% coverage)
- [ ] Update dependencies
- [ ] Improve CI/CD pipeline

## Low Priority
- [ ] Dark mode improvements
- [ ] Keyboard navigation
- [ ] Performance optimization
- [ ] Code documentation

## Tech Debt
- [ ] Remove deprecated API calls
- [ ] Migrate to new auth system
- [ ] Database query optimization`,
                category: "Todo",
                color: "yellow",
                tags: ["Backlog", "Project", "Tech Debt"],
                createdAt: "2024-12-01",
                updatedAt: "2025-01-02"
            }
        ]
    },
    {
        groupName: "Meeting Notes",
        notes: [
            {
                id: "note-meeting-1",
                title: "Architecture Discussion - Jan 2",
                content: `## Attendees
- Team Lead, Senior Dev, Platform Team

## Discussion Points
1. Migrate to microservices vs modular monolith
2. GraphQL federation setup
3. Event-driven architecture

## Decisions
- Start with modular monolith
- Prepare for future decomposition
- Use message queue for async operations
- GraphQL for client-facing API

## Action Items
- [ ] @me: Draft architecture doc
- [ ] @john: Evaluate message queues
- [ ] @sarah: POC for GraphQL gateway

## Next Steps
- Follow-up meeting in 2 weeks
- Present POC results`,
                category: "Work",
                color: "blue",
                tags: ["Meeting", "Architecture", "Decisions"],
                createdAt: "2025-01-02",
                updatedAt: "2025-01-02"
            },
            {
                id: "note-meeting-2",
                title: "Sprint Planning Notes",
                content: `## Sprint Goals
1. Complete user authentication flow
2. Implement dashboard MVP
3. Set up staging environment

## Story Points
- Total capacity: 40 points
- Planned: 35 points
- Buffer: 5 points

## Risk Items
- Third-party API integration delay
- Designer availability

## Dependencies
- Backend API ready by Wednesday
- Design assets by Thursday

## Definition of Done
- Code reviewed
- Tests passing
- Documented
- Deployed to staging`,
                category: "Work",
                color: "green",
                tags: ["Sprint", "Planning", "Agile"],
                createdAt: "2024-12-28",
                updatedAt: "2024-12-28"
            }
        ]
    }
];
