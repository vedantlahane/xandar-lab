// app/lab/hackathons/data/hackathons.ts
export type HackathonStatus = 'Upcoming' | 'Registered' | 'In Progress' | 'Completed' | 'Missed';
export type HackathonType = 'Online' | 'In-Person' | 'Hybrid';
export type HackathonPrize = 'Cash' | 'Swag' | 'Job Opportunity' | 'Credits' | 'None';

export interface Hackathon {
    id: string;
    name: string;
    organizer: string;
    description: string;
    status: HackathonStatus;
    type: HackathonType;
    startDate: string;
    endDate: string;
    registrationDeadline?: string;
    website: string;
    prizes?: HackathonPrize[];
    themes?: string[];
    teamSize?: string;
    result?: {
        placement?: string;
        projectName?: string;
        projectUrl?: string;
        notes?: string;
    };
}

export interface HackathonMonth {
    month: string;
    hackathons: Hackathon[];
}

export const HACKATHONS: HackathonMonth[] = [
    {
        month: "January 2025",
        hackathons: [
            {
                id: "hack-jan-1",
                name: "Global Game Jam 2025",
                organizer: "Global Game Jam Inc.",
                description: "The world's largest game jam event where participants create games in 48 hours based on a secret theme revealed at the start.",
                status: "Upcoming",
                type: "Hybrid",
                startDate: "2025-01-24",
                endDate: "2025-01-26",
                registrationDeadline: "2025-01-20",
                website: "https://globalgamejam.org",
                prizes: ["Swag"],
                themes: ["Game Development", "Creativity", "48 Hours"],
                teamSize: "1-8"
            },
            {
                id: "hack-jan-2",
                name: "AI for Good Hackathon",
                organizer: "Microsoft",
                description: "Build AI-powered solutions to address social and environmental challenges. Focus on accessibility, sustainability, and healthcare.",
                status: "Registered",
                type: "Online",
                startDate: "2025-01-15",
                endDate: "2025-01-17",
                registrationDeadline: "2025-01-10",
                website: "https://microsoft.com/ai-for-good",
                prizes: ["Cash", "Job Opportunity", "Credits"],
                themes: ["AI/ML", "Social Impact", "Sustainability"],
                teamSize: "2-5"
            }
        ]
    },
    {
        month: "February 2025",
        hackathons: [
            {
                id: "hack-feb-1",
                name: "ETHDenver 2025",
                organizer: "ETHDenver",
                description: "The largest and longest-running Ethereum hackathon. Build dApps, smart contracts, and Web3 solutions.",
                status: "Upcoming",
                type: "In-Person",
                startDate: "2025-02-23",
                endDate: "2025-03-02",
                registrationDeadline: "2025-02-01",
                website: "https://ethdenver.com",
                prizes: ["Cash", "Job Opportunity"],
                themes: ["Web3", "Blockchain", "DeFi", "NFTs"],
                teamSize: "1-5"
            },
            {
                id: "hack-feb-2",
                name: "Hack for Health",
                organizer: "Health Tech Foundation",
                description: "Create innovative solutions for healthcare challenges including mental health, accessibility, and patient care.",
                status: "Upcoming",
                type: "Online",
                startDate: "2025-02-14",
                endDate: "2025-02-16",
                website: "https://hackforhealth.io",
                prizes: ["Cash", "Swag"],
                themes: ["Healthcare", "Accessibility", "Mental Health"],
                teamSize: "2-4"
            }
        ]
    },
    {
        month: "December 2024",
        hackathons: [
            {
                id: "hack-dec-1",
                name: "Advent of Code 2024",
                organizer: "Eric Wastl",
                description: "Annual coding challenge with daily puzzles from December 1-25. Solve algorithmic problems in any language.",
                status: "Completed",
                type: "Online",
                startDate: "2024-12-01",
                endDate: "2024-12-25",
                website: "https://adventofcode.com/2024",
                prizes: ["None"],
                themes: ["Algorithms", "Puzzles", "Daily Challenges"],
                teamSize: "1",
                result: {
                    placement: "Completed 22/25 days",
                    notes: "Struggled with day 18 and 23 - both involved complex graph algorithms. Need to review BFS/DFS variations."
                }
            },
            {
                id: "hack-dec-2",
                name: "DevPost Winter Hackathon",
                organizer: "DevPost",
                description: "Open-themed hackathon to build anything innovative. Sponsored tracks for AI, Web3, and Developer Tools.",
                status: "Completed",
                type: "Online",
                startDate: "2024-12-06",
                endDate: "2024-12-20",
                website: "https://devpost.com/hackathons",
                prizes: ["Cash", "Swag", "Credits"],
                themes: ["Open Theme", "AI", "Developer Tools"],
                teamSize: "1-4",
                result: {
                    placement: "Top 10 in AI Track",
                    projectName: "CodeReview AI",
                    projectUrl: "https://github.com/username/codereview-ai",
                    notes: "Built an AI-powered code review assistant. Judges liked the UX but suggested more language support."
                }
            }
        ]
    },
    {
        month: "November 2024",
        hackathons: [
            {
                id: "hack-nov-1",
                name: "GitHub Universe Hackathon",
                organizer: "GitHub",
                description: "Build tools and integrations using GitHub APIs, Actions, and Copilot extensions.",
                status: "Completed",
                type: "Online",
                startDate: "2024-11-15",
                endDate: "2024-11-17",
                website: "https://githubuniverse.com",
                prizes: ["Cash", "Swag", "Job Opportunity"],
                themes: ["GitHub", "Developer Tools", "Automation"],
                teamSize: "1-3",
                result: {
                    placement: "Participated",
                    projectName: "PR Insights Action",
                    projectUrl: "https://github.com/username/pr-insights",
                    notes: "Created a GitHub Action for automated PR analysis. Learned a lot about GitHub APIs but didn't win."
                }
            },
            {
                id: "hack-nov-2",
                name: "Hacktoberfest Finale",
                organizer: "DigitalOcean",
                description: "Special finale event for Hacktoberfest contributors with prizes for top open source contributions.",
                status: "Completed",
                type: "Online",
                startDate: "2024-11-01",
                endDate: "2024-11-03",
                website: "https://hacktoberfest.com",
                prizes: ["Swag"],
                themes: ["Open Source", "Contributing", "Community"],
                teamSize: "1",
                result: {
                    placement: "Completed 4+ PRs",
                    notes: "Contributed to React, Tailwind CSS, and two smaller projects. Received swag pack!"
                }
            }
        ]
    },
    {
        month: "October 2024",
        hackathons: [
            {
                id: "hack-oct-1",
                name: "HackMIT 2024",
                organizer: "MIT",
                description: "Prestigious college hackathon hosted by MIT. Build innovative projects in 24 hours.",
                status: "Missed",
                type: "In-Person",
                startDate: "2024-10-12",
                endDate: "2024-10-13",
                website: "https://hackmit.org",
                prizes: ["Cash", "Job Opportunity"],
                themes: ["Open Theme", "Innovation"],
                teamSize: "1-4"
            },
            {
                id: "hack-oct-2",
                name: "Cloudflare Developer Week Hackathon",
                organizer: "Cloudflare",
                description: "Build applications using Cloudflare Workers, D1, R2, and other Cloudflare products.",
                status: "Completed",
                type: "Online",
                startDate: "2024-10-07",
                endDate: "2024-10-14",
                website: "https://developers.cloudflare.com",
                prizes: ["Cash", "Credits"],
                themes: ["Edge Computing", "Serverless", "Performance"],
                teamSize: "1-3",
                result: {
                    placement: "Honorable Mention",
                    projectName: "Edge Analytics",
                    projectUrl: "https://github.com/username/edge-analytics",
                    notes: "Built real-time analytics on the edge using Workers and D1."
                }
            }
        ]
    },
    {
        month: "September 2024",
        hackathons: [
            {
                id: "hack-sep-1",
                name: "PennApps XXIV",
                organizer: "University of Pennsylvania",
                description: "One of the oldest and largest college hackathons in the US.",
                status: "Completed",
                type: "In-Person",
                startDate: "2024-09-06",
                endDate: "2024-09-08",
                website: "https://pennapps.com",
                prizes: ["Cash", "Swag", "Job Opportunity"],
                themes: ["Open Theme", "Sustainability", "Education"],
                teamSize: "1-4",
                result: {
                    placement: "Best Use of AWS",
                    projectName: "StudySync",
                    projectUrl: "https://github.com/username/studysync",
                    notes: "Won sponsor prize! Built a collaborative study platform with real-time features."
                }
            }
        ]
    }
];
