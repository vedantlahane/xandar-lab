export type DocCategory = 'Cheatsheet' | 'Guide' | 'Reference' | 'Tutorial' | 'Notes';
export type DocTechnology = 'JavaScript' | 'TypeScript' | 'React' | 'Node.js' | 'Python' | 'DSA' | 'System Design' | 'Git' | 'Docker' | 'CSS' | 'Other';

export interface Document {
    id: string;
    title: string;
    description: string;
    category: DocCategory;
    technology: DocTechnology;
    content: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;
}

export interface DocSection {
    sectionName: string;
    documents: Document[];
}

export const DOCUMENTS: DocSection[] = [
    {
        sectionName: "JavaScript Essentials",
        documents: [
            {
                id: "doc-js-1",
                title: "JavaScript Array Methods",
                description: "Complete reference for all array methods with examples",
                category: "Cheatsheet",
                technology: "JavaScript",
                content: `# JavaScript Array Methods

## Mutating Methods
- **push()** - Adds elements to the end
- **pop()** - Removes the last element
- **shift()** - Removes the first element
- **unshift()** - Adds elements to the beginning
- **splice()** - Add/remove elements at any position
- **sort()** - Sorts elements in place
- **reverse()** - Reverses the array

## Non-Mutating Methods
- **map()** - Creates a new array with transformed elements
- **filter()** - Creates array with elements that pass a test
- **reduce()** - Reduces array to a single value
- **find()** - Returns first element matching condition
- **findIndex()** - Returns index of first matching element
- **every()** - Tests if all elements pass
- **some()** - Tests if any element passes
- **slice()** - Returns a portion of the array
- **concat()** - Merges arrays
- **flat()** - Flattens nested arrays
- **flatMap()** - Maps then flattens`,
                tags: ["Arrays", "Methods", "Reference"],
                createdAt: "2024-01-15",
                updatedAt: "2024-12-01"
            },
            {
                id: "doc-js-2",
                title: "ES6+ Features Guide",
                description: "Modern JavaScript features from ES6 and beyond",
                category: "Guide",
                technology: "JavaScript",
                content: `# ES6+ Features

## Destructuring
\`\`\`javascript
const { name, age } = person;
const [first, second] = array;
\`\`\`

## Spread Operator
\`\`\`javascript
const newArray = [...oldArray, newItem];
const newObj = { ...oldObj, newProp: value };
\`\`\`

## Arrow Functions
\`\`\`javascript
const sum = (a, b) => a + b;
\`\`\`

## Template Literals
\`\`\`javascript
const greeting = \`Hello, \${name}!\`;
\`\`\`

## Async/Await
\`\`\`javascript
async function fetchData() {
    const data = await fetch(url);
    return data.json();
}
\`\`\``,
                tags: ["ES6", "Modern JS", "Syntax"],
                createdAt: "2024-02-10",
                updatedAt: "2024-11-20"
            },
            {
                id: "doc-js-3",
                title: "Promises & Async Patterns",
                description: "Understanding asynchronous JavaScript",
                category: "Tutorial",
                technology: "JavaScript",
                content: `# Async JavaScript

## Promises
Promises represent eventual completion or failure of async operations.

## Promise States
- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

## Common Patterns
- Promise.all() - Wait for all promises
- Promise.race() - First to settle wins
- Promise.allSettled() - Wait for all, regardless of outcome`,
                tags: ["Async", "Promises", "Patterns"],
                createdAt: "2024-03-05",
                updatedAt: "2024-10-15"
            }
        ]
    },
    {
        sectionName: "React Development",
        documents: [
            {
                id: "doc-react-1",
                title: "React Hooks Cheatsheet",
                description: "All React hooks with usage examples",
                category: "Cheatsheet",
                technology: "React",
                content: `# React Hooks

## useState
\`\`\`jsx
const [state, setState] = useState(initialValue);
\`\`\`

## useEffect
\`\`\`jsx
useEffect(() => {
    // Side effect
    return () => cleanup();
}, [dependencies]);
\`\`\`

## useContext
\`\`\`jsx
const value = useContext(MyContext);
\`\`\`

## useRef
\`\`\`jsx
const ref = useRef(initialValue);
\`\`\`

## useMemo
\`\`\`jsx
const memoized = useMemo(() => compute(a, b), [a, b]);
\`\`\`

## useCallback
\`\`\`jsx
const callback = useCallback(() => doSomething(a), [a]);
\`\`\``,
                tags: ["Hooks", "State", "Effects"],
                createdAt: "2024-01-20",
                updatedAt: "2024-12-05"
            },
            {
                id: "doc-react-2",
                title: "React Performance Optimization",
                description: "Tips and techniques for optimizing React apps",
                category: "Guide",
                technology: "React",
                content: `# React Performance

## Memoization
- React.memo for components
- useMemo for expensive calculations
- useCallback for stable function references

## Code Splitting
- React.lazy for component splitting
- Suspense for loading states

## Virtualization
- Use react-window or react-virtualized
- Render only visible items

## Key Best Practices
- Use stable, unique keys
- Avoid index as key when list changes`,
                tags: ["Performance", "Optimization", "Best Practices"],
                createdAt: "2024-04-12",
                updatedAt: "2024-11-30"
            },
            {
                id: "doc-react-3",
                title: "React Component Patterns",
                description: "Common patterns for building reusable components",
                category: "Reference",
                technology: "React",
                content: `# Component Patterns

## Compound Components
Components that work together sharing implicit state.

## Render Props
Pass a function as children for flexible rendering.

## Higher-Order Components
Functions that take a component and return an enhanced one.

## Custom Hooks
Extract reusable logic into custom hooks.

## Controlled vs Uncontrolled
Form elements managed by React state vs DOM.`,
                tags: ["Patterns", "Components", "Architecture"],
                createdAt: "2024-05-08",
                updatedAt: "2024-10-25"
            }
        ]
    },
    {
        sectionName: "TypeScript",
        documents: [
            {
                id: "doc-ts-1",
                title: "TypeScript Type System",
                description: "Understanding TypeScript's type system",
                category: "Guide",
                technology: "TypeScript",
                content: `# TypeScript Types

## Primitive Types
- string, number, boolean
- null, undefined
- symbol, bigint

## Complex Types
- Arrays: number[] or Array<number>
- Tuples: [string, number]
- Objects: { name: string; age: number }

## Advanced Types
- Union: string | number
- Intersection: A & B
- Generics: <T>
- Utility Types: Partial, Required, Pick, Omit`,
                tags: ["Types", "Basics", "Reference"],
                createdAt: "2024-02-28",
                updatedAt: "2024-11-15"
            },
            {
                id: "doc-ts-2",
                title: "TypeScript Generics Deep Dive",
                description: "Master generics for reusable type-safe code",
                category: "Tutorial",
                technology: "TypeScript",
                content: `# Generics in TypeScript

## Basic Generics
\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

## Generic Constraints
\`\`\`typescript
function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;
}
\`\`\`

## Generic Interfaces
\`\`\`typescript
interface Container<T> {
    value: T;
    getValue(): T;
}
\`\`\``,
                tags: ["Generics", "Advanced", "Type Safety"],
                createdAt: "2024-06-15",
                updatedAt: "2024-12-01"
            }
        ]
    },
    {
        sectionName: "Data Structures & Algorithms",
        documents: [
            {
                id: "doc-dsa-1",
                title: "Big O Notation Cheatsheet",
                description: "Time and space complexity reference",
                category: "Cheatsheet",
                technology: "DSA",
                content: `# Big O Notation

## Common Complexities
- O(1) - Constant
- O(log n) - Logarithmic
- O(n) - Linear
- O(n log n) - Linearithmic
- O(n²) - Quadratic
- O(2ⁿ) - Exponential
- O(n!) - Factorial

## Data Structure Operations
| Structure | Access | Search | Insert | Delete |
|-----------|--------|--------|--------|--------|
| Array     | O(1)   | O(n)   | O(n)   | O(n)   |
| Stack     | O(n)   | O(n)   | O(1)   | O(1)   |
| Queue     | O(n)   | O(n)   | O(1)   | O(1)   |
| Hash Map  | N/A    | O(1)   | O(1)   | O(1)   |
| BST       | O(log n)| O(log n)| O(log n)| O(log n)|`,
                tags: ["Complexity", "Big O", "Reference"],
                createdAt: "2024-01-10",
                updatedAt: "2024-11-28"
            },
            {
                id: "doc-dsa-2",
                title: "Sorting Algorithms Comparison",
                description: "Comparison of common sorting algorithms",
                category: "Reference",
                technology: "DSA",
                content: `# Sorting Algorithms

## Comparison-Based Sorts
| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble    | O(n) | O(n²)   | O(n²) | O(1)  | Yes    |
| Selection | O(n²)| O(n²)   | O(n²) | O(1)  | No     |
| Insertion | O(n) | O(n²)   | O(n²) | O(1)  | Yes    |
| Merge     | O(n log n)| O(n log n)| O(n log n)| O(n)| Yes |
| Quick     | O(n log n)| O(n log n)| O(n²)| O(log n)| No |
| Heap      | O(n log n)| O(n log n)| O(n log n)| O(1)| No |

## Non-Comparison Sorts
- Counting Sort: O(n + k)
- Radix Sort: O(nk)
- Bucket Sort: O(n + k)`,
                tags: ["Sorting", "Algorithms", "Comparison"],
                createdAt: "2024-03-20",
                updatedAt: "2024-10-10"
            },
            {
                id: "doc-dsa-3",
                title: "Graph Algorithms Guide",
                description: "Essential graph traversal and pathfinding algorithms",
                category: "Guide",
                technology: "DSA",
                content: `# Graph Algorithms

## Traversal
- **BFS** - Level-order, shortest path in unweighted
- **DFS** - Deep exploration, cycle detection, topological sort

## Shortest Path
- **Dijkstra** - Single source, non-negative weights
- **Bellman-Ford** - Handles negative weights
- **Floyd-Warshall** - All pairs shortest path

## Minimum Spanning Tree
- **Kruskal's** - Edge-based, uses Union-Find
- **Prim's** - Vertex-based, uses Priority Queue

## Other Important Algorithms
- Topological Sort (DAGs)
- Strongly Connected Components (Tarjan's, Kosaraju's)
- Bipartite Check`,
                tags: ["Graphs", "Traversal", "Pathfinding"],
                createdAt: "2024-04-25",
                updatedAt: "2024-11-05"
            }
        ]
    },
    {
        sectionName: "System Design",
        documents: [
            {
                id: "doc-sd-1",
                title: "System Design Fundamentals",
                description: "Core concepts for system design interviews",
                category: "Guide",
                technology: "System Design",
                content: `# System Design Fundamentals

## Key Concepts
- Scalability (Horizontal vs Vertical)
- Load Balancing
- Caching (CDN, Application, Database)
- Database Sharding
- Replication
- CAP Theorem
- Consistency Patterns

## Common Components
- Load Balancers (Nginx, HAProxy)
- Caches (Redis, Memcached)
- Message Queues (Kafka, RabbitMQ)
- Databases (SQL, NoSQL)
- CDNs (CloudFlare, Akamai)`,
                tags: ["Scalability", "Architecture", "Fundamentals"],
                createdAt: "2024-02-15",
                updatedAt: "2024-12-01"
            },
            {
                id: "doc-sd-2",
                title: "Database Design Patterns",
                description: "Patterns for designing scalable databases",
                category: "Reference",
                technology: "System Design",
                content: `# Database Patterns

## SQL vs NoSQL
- SQL: ACID, structured, relationships
- NoSQL: Flexible schema, horizontal scaling

## Partitioning Strategies
- Range-based
- Hash-based
- Directory-based

## Replication
- Master-Slave
- Master-Master
- Multi-Region

## Indexing Strategies
- B-Tree indexes
- Hash indexes
- Composite indexes`,
                tags: ["Database", "Patterns", "Scaling"],
                createdAt: "2024-05-30",
                updatedAt: "2024-11-20"
            }
        ]
    },
    {
        sectionName: "DevOps & Tools",
        documents: [
            {
                id: "doc-git-1",
                title: "Git Commands Cheatsheet",
                description: "Essential Git commands for daily workflow",
                category: "Cheatsheet",
                technology: "Git",
                content: `# Git Commands

## Basic Commands
\`\`\`bash
git init                  # Initialize repo
git clone <url>           # Clone repo
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push origin main      # Push to remote
git pull origin main      # Pull from remote
\`\`\`

## Branching
\`\`\`bash
git branch <name>         # Create branch
git checkout <name>       # Switch branch
git checkout -b <name>    # Create and switch
git merge <branch>        # Merge branch
git rebase <branch>       # Rebase onto branch
\`\`\`

## Undoing Changes
\`\`\`bash
git reset --soft HEAD~1   # Undo commit, keep changes
git reset --hard HEAD~1   # Undo commit, discard changes
git revert <commit>       # Create reverting commit
git stash                 # Stash changes
\`\`\``,
                tags: ["Git", "Commands", "Version Control"],
                createdAt: "2024-01-05",
                updatedAt: "2024-11-25"
            },
            {
                id: "doc-docker-1",
                title: "Docker Essentials",
                description: "Docker commands and best practices",
                category: "Cheatsheet",
                technology: "Docker",
                content: `# Docker Essentials

## Container Commands
\`\`\`bash
docker run <image>        # Run container
docker ps                 # List running containers
docker stop <id>          # Stop container
docker rm <id>            # Remove container
docker logs <id>          # View logs
docker exec -it <id> sh   # Shell into container
\`\`\`

## Image Commands
\`\`\`bash
docker build -t <name> .  # Build image
docker images             # List images
docker rmi <id>           # Remove image
docker pull <image>       # Pull from registry
docker push <image>       # Push to registry
\`\`\`

## Docker Compose
\`\`\`bash
docker-compose up         # Start services
docker-compose down       # Stop services
docker-compose logs       # View logs
\`\`\``,
                tags: ["Docker", "Containers", "DevOps"],
                createdAt: "2024-03-10",
                updatedAt: "2024-10-30"
            }
        ]
    },
    {
        sectionName: "CSS & Styling",
        documents: [
            {
                id: "doc-css-1",
                title: "Flexbox Cheatsheet",
                description: "Complete guide to CSS Flexbox",
                category: "Cheatsheet",
                technology: "CSS",
                content: `# CSS Flexbox

## Container Properties
\`\`\`css
display: flex;
flex-direction: row | column;
justify-content: flex-start | center | space-between;
align-items: stretch | center | flex-start;
flex-wrap: nowrap | wrap;
gap: 1rem;
\`\`\`

## Item Properties
\`\`\`css
flex: 1;                    /* grow, shrink, basis */
flex-grow: 1;
flex-shrink: 0;
flex-basis: 200px;
align-self: center;
order: 1;
\`\`\``,
                tags: ["Flexbox", "Layout", "CSS"],
                createdAt: "2024-02-20",
                updatedAt: "2024-11-10"
            },
            {
                id: "doc-css-2",
                title: "CSS Grid Cheatsheet",
                description: "Complete guide to CSS Grid",
                category: "Cheatsheet",
                technology: "CSS",
                content: `# CSS Grid

## Container Properties
\`\`\`css
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: auto;
gap: 1rem;
grid-template-areas: "header header" "sidebar main";
\`\`\`

## Item Properties
\`\`\`css
grid-column: 1 / 3;
grid-row: span 2;
grid-area: header;
justify-self: center;
align-self: start;
\`\`\`

## Auto-fit & Auto-fill
\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
\`\`\``,
                tags: ["Grid", "Layout", "CSS"],
                createdAt: "2024-02-22",
                updatedAt: "2024-11-12"
            }
        ]
    }
];
