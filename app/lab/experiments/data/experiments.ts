export type ExperimentStatus = 'Active' | 'Completed' | 'Archived' | 'Planning';
export type ExperimentType = 'Frontend' | 'Backend' | 'Full Stack' | 'AI/ML' | 'Mobile' | 'DevOps' | 'Other';

export interface Experiment {
    id: string;
    title: string;
    description: string;
    status: ExperimentStatus;
    type: ExperimentType;
    technologies: string[];
    startDate: string;
    endDate?: string;
    githubUrl?: string;
    demoUrl?: string;
    notes?: string;
    learnings?: string[];
}

export interface ExperimentCategory {
    categoryName: string;
    experiments: Experiment[];
}

export const EXPERIMENTS: ExperimentCategory[] = [
    {
        categoryName: "Web Development",
        experiments: [
            {
                id: "exp-web-1",
                title: "Real-time Collaboration Editor",
                description: "Building a Google Docs-like real-time collaborative text editor using WebSockets and CRDT",
                status: "Active",
                type: "Full Stack",
                technologies: ["React", "Node.js", "WebSocket", "Y.js", "MongoDB"],
                startDate: "2024-11-01",
                githubUrl: "https://github.com/username/collab-editor",
                notes: "Exploring operational transformation vs CRDT for conflict resolution. Currently implementing Y.js for shared state management.",
                learnings: [
                    "CRDT provides eventual consistency without central server",
                    "WebSocket keeps connection alive for real-time updates",
                    "Debouncing essential for performance"
                ]
            },
            {
                id: "exp-web-2",
                title: "Component Design System",
                description: "Creating a reusable React component library with Storybook documentation",
                status: "Completed",
                type: "Frontend",
                technologies: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Radix UI"],
                startDate: "2024-08-15",
                endDate: "2024-10-20",
                githubUrl: "https://github.com/username/design-system",
                demoUrl: "https://design-system.example.com",
                notes: "Successfully created 50+ reusable components with full accessibility support.",
                learnings: [
                    "Compound components pattern for complex UIs",
                    "CSS variables for theming flexibility",
                    "Storybook addons for testing and documentation"
                ]
            },
            {
                id: "exp-web-3",
                title: "SSR vs CSR Performance Analysis",
                description: "Benchmarking Next.js App Router vs traditional React SPA for various use cases",
                status: "Completed",
                type: "Frontend",
                technologies: ["Next.js", "React", "Lighthouse", "Web Vitals"],
                startDate: "2024-07-01",
                endDate: "2024-07-30",
                notes: "Measured LCP, FID, CLS across different page types. SSR shows 40% better LCP for content-heavy pages.",
                learnings: [
                    "SSR best for content-heavy, SEO-important pages",
                    "CSR better for highly interactive dashboards",
                    "Hybrid approach often optimal"
                ]
            }
        ]
    },
    {
        categoryName: "API & Backend",
        experiments: [
            {
                id: "exp-api-1",
                title: "GraphQL Federation Setup",
                description: "Implementing Apollo Federation for microservices architecture",
                status: "Active",
                type: "Backend",
                technologies: ["GraphQL", "Apollo Server", "Node.js", "Docker", "Kubernetes"],
                startDate: "2024-10-15",
                githubUrl: "https://github.com/username/graphql-federation",
                notes: "Setting up gateway and subgraphs. Exploring @key and @requires directives for entity resolution.",
                learnings: [
                    "Federation enables independent service deployment",
                    "@external fields must be defined in owning service"
                ]
            },
            {
                id: "exp-api-2",
                title: "Rate Limiting Strategies",
                description: "Comparing token bucket, sliding window, and leaky bucket algorithms",
                status: "Completed",
                type: "Backend",
                technologies: ["Redis", "Node.js", "Express", "Lua Scripts"],
                startDate: "2024-06-01",
                endDate: "2024-06-30",
                notes: "Implemented all three algorithms using Redis. Token bucket most flexible for API rate limiting.",
                learnings: [
                    "Token bucket allows burst traffic",
                    "Sliding window more accurate but complex",
                    "Redis Lua scripts for atomic operations"
                ]
            },
            {
                id: "exp-api-3",
                title: "Event Sourcing with Kafka",
                description: "Building an event-sourced system using Kafka and event store",
                status: "Planning",
                type: "Backend",
                technologies: ["Apache Kafka", "Node.js", "PostgreSQL", "Event Store"],
                startDate: "2025-01-15",
                notes: "Planning phase. Will explore CQRS pattern alongside event sourcing.",
                learnings: []
            }
        ]
    },
    {
        categoryName: "AI & Machine Learning",
        experiments: [
            {
                id: "exp-ai-1",
                title: "RAG Chatbot Implementation",
                description: "Building a retrieval-augmented generation chatbot for documentation",
                status: "Active",
                type: "AI/ML",
                technologies: ["LangChain", "OpenAI", "Pinecone", "Python", "FastAPI"],
                startDate: "2024-11-20",
                githubUrl: "https://github.com/username/rag-chatbot",
                notes: "Using LangChain for orchestration. Pinecone for vector storage. Testing different chunking strategies.",
                learnings: [
                    "Chunk size affects retrieval quality",
                    "Hybrid search (keyword + semantic) often best",
                    "Prompt engineering crucial for answer quality"
                ]
            },
            {
                id: "exp-ai-2",
                title: "Fine-tuning LLM for Code Review",
                description: "Fine-tuning a smaller LLM specifically for code review suggestions",
                status: "Planning",
                type: "AI/ML",
                technologies: ["Hugging Face", "PyTorch", "LoRA", "Python"],
                startDate: "2025-02-01",
                notes: "Collecting dataset from open source code reviews. Will use LoRA for efficient fine-tuning.",
                learnings: []
            },
            {
                id: "exp-ai-3",
                title: "Image Generation Pipeline",
                description: "Setting up a Stable Diffusion pipeline with custom models",
                status: "Archived",
                type: "AI/ML",
                technologies: ["Stable Diffusion", "Python", "ComfyUI", "CUDA"],
                startDate: "2024-03-01",
                endDate: "2024-05-15",
                notes: "Explored ControlNet, LoRA training, and inpainting. Archived due to compute costs.",
                learnings: [
                    "ControlNet provides precise control over output",
                    "LoRA efficient for style transfer",
                    "GPU memory management critical"
                ]
            }
        ]
    },
    {
        categoryName: "DevOps & Infrastructure",
        experiments: [
            {
                id: "exp-devops-1",
                title: "GitOps with ArgoCD",
                description: "Implementing GitOps workflow for Kubernetes deployments",
                status: "Completed",
                type: "DevOps",
                technologies: ["ArgoCD", "Kubernetes", "Helm", "GitHub Actions"],
                startDate: "2024-09-01",
                endDate: "2024-10-15",
                githubUrl: "https://github.com/username/gitops-demo",
                notes: "Successfully set up automated deployments. All changes go through Git PRs.",
                learnings: [
                    "Git as single source of truth simplifies auditing",
                    "ArgoCD sync policies for automated vs manual",
                    "Helm charts with values per environment"
                ]
            },
            {
                id: "exp-devops-2",
                title: "Observability Stack Setup",
                description: "Building a complete observability stack with Grafana, Prometheus, and Loki",
                status: "Active",
                type: "DevOps",
                technologies: ["Grafana", "Prometheus", "Loki", "Tempo", "OpenTelemetry"],
                startDate: "2024-12-01",
                notes: "Implementing the three pillars: metrics, logs, and traces. Using OpenTelemetry for instrumentation.",
                learnings: [
                    "OpenTelemetry provides vendor-neutral instrumentation",
                    "Loki labels should be low cardinality"
                ]
            },
            {
                id: "exp-devops-3",
                title: "Terraform Module Library",
                description: "Creating reusable Terraform modules for common AWS patterns",
                status: "Active",
                type: "DevOps",
                technologies: ["Terraform", "AWS", "GitHub Actions"],
                startDate: "2024-11-10",
                githubUrl: "https://github.com/username/terraform-modules",
                notes: "Building modules for VPC, ECS, RDS, and Lambda. Following Terraform best practices.",
                learnings: [
                    "Module versioning enables safe updates",
                    "Variable validation improves usability"
                ]
            }
        ]
    },
    {
        categoryName: "Mobile Development",
        experiments: [
            {
                id: "exp-mobile-1",
                title: "React Native New Architecture",
                description: "Migrating an app to React Native's new architecture with Fabric and TurboModules",
                status: "Active",
                type: "Mobile",
                technologies: ["React Native", "TypeScript", "Hermes", "Fabric"],
                startDate: "2024-12-10",
                notes: "Testing performance improvements with new architecture. Hermes shows significant startup time reduction.",
                learnings: [
                    "New architecture improves JS-Native bridge performance",
                    "Hermes reduces bundle size and startup time"
                ]
            },
            {
                id: "exp-mobile-2",
                title: "Offline-First Mobile App",
                description: "Building an offline-first app with sync capabilities",
                status: "Completed",
                type: "Mobile",
                technologies: ["React Native", "WatermelonDB", "Node.js", "PostgreSQL"],
                startDate: "2024-05-01",
                endDate: "2024-07-31",
                notes: "Implemented optimistic updates and conflict resolution. WatermelonDB handles local storage efficiently.",
                learnings: [
                    "Optimistic updates improve perceived performance",
                    "Conflict resolution strategy depends on data type",
                    "Last-write-wins simplest but not always correct"
                ]
            }
        ]
    }
];
