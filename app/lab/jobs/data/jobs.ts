// app/lab/jobs/data/jobs.ts
export type JobPlatform = 
  | 'LinkedIn' 
  | 'Indeed' 
  | 'Glassdoor' 
  | 'AngelList' 
  | 'Wellfound' 
  | 'Internshala' 
  | 'Naukri' 
  | 'HackerRank' 
  | 'LeetCode' 
  | 'GitHub' 
  | 'Company Direct'
  | 'Other';

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';

export type ApplicationStatus = 
  | 'bookmarked' 
  | 'applied' 
  | 'phone-screen' 
  | 'technical-interview' 
  | 'onsite' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  platform: JobPlatform;
  url: string;
  description: string;
  requirements?: string[];
  salary?: string;
  postedDate?: string;
  deadline?: string;
  tags?: string[];
  remote?: boolean;
}

export interface JobCategory {
  categoryName: string;
  jobs: Job[];
}

// Sample job listings aggregated from various platforms
export const JOB_LISTINGS: JobCategory[] = [
  {
    categoryName: "Software Engineering",
    jobs: [
      {
        id: "swe-1",
        title: "Software Engineer Intern",
        company: "Google",
        location: "Mountain View, CA",
        type: "Internship",
        platform: "LinkedIn",
        url: "https://careers.google.com/",
        description: "Join Google's engineering team for a summer internship. Work on real-world projects that impact billions of users.",
        requirements: ["Currently pursuing BS/MS in CS", "Strong coding skills", "Experience with data structures"],
        salary: "$8,000 - $10,000/month",
        tags: ["FAANG", "Summer 2026", "Remote Friendly"],
        remote: true
      },
      {
        id: "swe-2",
        title: "Software Development Engineer - New Grad",
        company: "Amazon",
        location: "Seattle, WA",
        type: "Full-time",
        platform: "Company Direct",
        url: "https://amazon.jobs/",
        description: "Build and operate scalable distributed systems. Work with teams across Amazon to deliver customer-facing features.",
        requirements: ["BS/MS in Computer Science", "Proficiency in Java, Python, or C++", "Problem-solving skills"],
        salary: "$150,000 - $180,000/year",
        tags: ["FAANG", "New Grad", "2026"],
        remote: false
      },
      {
        id: "swe-3",
        title: "Frontend Engineer Intern",
        company: "Meta",
        location: "Menlo Park, CA",
        type: "Internship",
        platform: "LinkedIn",
        url: "https://metacareers.com/",
        description: "Work on React-based applications serving billions of users. Collaborate with world-class engineers.",
        requirements: ["Strong JavaScript/TypeScript skills", "React experience", "Understanding of web technologies"],
        salary: "$9,000/month",
        tags: ["FAANG", "Frontend", "React"],
        remote: true
      },
      {
        id: "swe-4",
        title: "Backend Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        type: "Full-time",
        platform: "Wellfound",
        url: "https://stripe.com/jobs",
        description: "Build financial infrastructure for the internet. Work on APIs that power millions of businesses.",
        requirements: ["Experience with Ruby, Go, or Java", "Understanding of distributed systems", "API design experience"],
        salary: "$170,000 - $210,000/year",
        tags: ["Fintech", "API", "Payments"],
        remote: true
      },
      {
        id: "swe-5",
        title: "Full Stack Developer Intern",
        company: "Razorpay",
        location: "Bangalore, India",
        type: "Internship",
        platform: "Internshala",
        url: "https://razorpay.com/jobs/",
        description: "Join India's leading payments company. Build products that power millions of businesses.",
        requirements: ["Knowledge of React and Node.js", "Understanding of databases", "Currently enrolled in BTech/BE"],
        salary: "₹50,000 - ₹75,000/month",
        tags: ["Fintech", "India", "Startup"],
        remote: true
      }
    ]
  },
  {
    categoryName: "Machine Learning & AI",
    jobs: [
      {
        id: "ml-1",
        title: "ML Engineer Intern",
        company: "OpenAI",
        location: "San Francisco, CA",
        type: "Internship",
        platform: "Company Direct",
        url: "https://openai.com/careers",
        description: "Work on cutting-edge AI models. Research and develop new approaches to machine learning.",
        requirements: ["Strong math background", "Experience with PyTorch/TensorFlow", "Research experience preferred"],
        salary: "$10,000/month",
        tags: ["AI", "Research", "LLMs"],
        remote: false
      },
      {
        id: "ml-2",
        title: "Research Scientist - AI",
        company: "DeepMind",
        location: "London, UK",
        type: "Full-time",
        platform: "LinkedIn",
        url: "https://deepmind.com/careers",
        description: "Push the boundaries of AI research. Work on projects like AlphaFold and Gemini.",
        requirements: ["PhD in ML, CS, or related field", "Publications in top venues", "Strong coding abilities"],
        salary: "£120,000 - £180,000/year",
        tags: ["Research", "PhD", "Publications"],
        remote: false
      },
      {
        id: "ml-3",
        title: "Data Science Intern",
        company: "Netflix",
        location: "Los Gatos, CA",
        type: "Internship",
        platform: "Glassdoor",
        url: "https://jobs.netflix.com/",
        description: "Work on recommendation systems and personalization algorithms serving 200M+ subscribers.",
        requirements: ["Strong Python and SQL skills", "Statistics background", "ML coursework"],
        salary: "$8,500/month",
        tags: ["Entertainment", "Recommendations", "Data"],
        remote: true
      }
    ]
  },
  {
    categoryName: "DevOps & Cloud",
    jobs: [
      {
        id: "devops-1",
        title: "Cloud Engineer Intern",
        company: "Microsoft",
        location: "Redmond, WA",
        type: "Internship",
        platform: "LinkedIn",
        url: "https://careers.microsoft.com/",
        description: "Work on Azure infrastructure serving millions of customers worldwide.",
        requirements: ["Knowledge of cloud platforms", "Linux/Windows administration", "Scripting skills"],
        salary: "$7,500/month",
        tags: ["Azure", "Cloud", "Infrastructure"],
        remote: true
      },
      {
        id: "devops-2",
        title: "Site Reliability Engineer",
        company: "Uber",
        location: "San Francisco, CA",
        type: "Full-time",
        platform: "Indeed",
        url: "https://www.uber.com/careers/",
        description: "Ensure 99.99% uptime for Uber's global platform. Work on massive-scale systems.",
        requirements: ["Experience with Kubernetes", "Strong Linux skills", "On-call experience"],
        salary: "$160,000 - $200,000/year",
        tags: ["SRE", "Scale", "On-call"],
        remote: true
      }
    ]
  },
  {
    categoryName: "Product & Design",
    jobs: [
      {
        id: "pm-1",
        title: "Associate Product Manager Intern",
        company: "Google",
        location: "Mountain View, CA",
        type: "Internship",
        platform: "Company Direct",
        url: "https://careers.google.com/",
        description: "Drive product development for Google's consumer products. Work with engineering and design teams.",
        requirements: ["Strong analytical skills", "Technical background preferred", "Leadership experience"],
        salary: "$9,000/month",
        tags: ["APM", "Leadership", "Consumer"],
        remote: false
      },
      {
        id: "ux-1",
        title: "UX Designer Intern",
        company: "Figma",
        location: "San Francisco, CA",
        type: "Internship",
        platform: "Wellfound",
        url: "https://figma.com/careers/",
        description: "Design the future of collaborative design tools. Work on features used by millions of designers.",
        requirements: ["Strong portfolio", "Figma proficiency", "Understanding of design systems"],
        salary: "$7,000/month",
        tags: ["Design", "Tools", "B2B"],
        remote: true
      }
    ]
  },
  {
    categoryName: "Startups & Early Stage",
    jobs: [
      {
        id: "startup-1",
        title: "Founding Engineer",
        company: "Stealth Startup",
        location: "Remote",
        type: "Full-time",
        platform: "Wellfound",
        url: "https://wellfound.com/",
        description: "Join a well-funded seed-stage startup. Build products from 0 to 1. Significant equity.",
        requirements: ["3+ years experience", "Full-stack skills", "Startup mindset"],
        salary: "$120,000 - $150,000 + equity",
        tags: ["Equity", "Early Stage", "Founding Team"],
        remote: true
      },
      {
        id: "startup-2",
        title: "Software Engineer Intern",
        company: "YC Startup W26",
        location: "San Francisco, CA",
        type: "Internship",
        platform: "HackerRank",
        url: "https://ycombinator.com/companies",
        description: "Join a Y Combinator backed startup. High growth environment with mentorship.",
        requirements: ["Strong fundamentals", "Move fast attitude", "Passion for building"],
        salary: "$5,000 - $7,000/month",
        tags: ["YC", "Startup", "High Growth"],
        remote: true
      }
    ]
  },
  {
    categoryName: "Open Source & Community",
    jobs: [
      {
        id: "oss-1",
        title: "Google Summer of Code",
        company: "Google",
        location: "Remote",
        type: "Internship",
        platform: "GitHub",
        url: "https://summerofcode.withgoogle.com/",
        description: "Contribute to open source projects. Get mentorship from experienced maintainers.",
        requirements: ["Open source contributions", "Strong programming skills", "Self-motivated"],
        salary: "$3,000 - $6,600 stipend",
        tags: ["Open Source", "GSoC", "Remote"],
        remote: true
      },
      {
        id: "oss-2",
        title: "LFX Mentorship",
        company: "Linux Foundation",
        location: "Remote",
        type: "Internship",
        platform: "GitHub",
        url: "https://lfx.linuxfoundation.org/tools/mentorship/",
        description: "Work on CNCF projects like Kubernetes, Prometheus. Learn from industry experts.",
        requirements: ["Interest in cloud-native", "Go/Python/Rust skills", "Open source experience"],
        salary: "$3,000 - $6,600 stipend",
        tags: ["CNCF", "Cloud Native", "Open Source"],
        remote: true
      }
    ]
  }
];

// Status colors and labels
export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  'bookmarked': { label: 'Bookmarked', color: 'text-zinc-500', bgColor: 'bg-zinc-500/10' },
  'applied': { label: 'Applied', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  'phone-screen': { label: 'Phone Screen', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  'technical-interview': { label: 'Technical Interview', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  'onsite': { label: 'Onsite', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  'offer': { label: 'Offer', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  'rejected': { label: 'Rejected', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  'withdrawn': { label: 'Withdrawn', color: 'text-zinc-400', bgColor: 'bg-zinc-400/10' },
};
