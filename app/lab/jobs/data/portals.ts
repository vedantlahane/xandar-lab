// app/lab/jobs/data/portals.ts

export interface Portal {
  id: string;
  name: string;
  url: string;
  /** category or type of portal */
  type: "General" | "Tech" | "Remote" | "Internships" | "Freelance" | "Company";
  /** does the portal list international positions? */
  international: boolean;
  /** remote-friendly listings available? */
  remote: boolean;
  /** optional region/primary country */
  region?: string;
}

export const PORTALS: Portal[] = [
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/jobs", type: "General", international: true, remote: true },
  { id: "indeed", name: "Indeed", url: "https://www.indeed.com", type: "General", international: true, remote: true },
  { id: "glassdoor", name: "Glassdoor", url: "https://www.glassdoor.com/Job", type: "General", international: true, remote: true },
  { id: "monster", name: "Monster", url: "https://www.monster.com", type: "General", international: true, remote: true },
  { id: "angellist", name: "AngelList", url: "https://angel.co/jobs", type: "Tech", international: true, remote: true },
  { id: "wellfound", name: "Wellfound (formerly AngelList Talent)", url: "https://wellfound.com", type: "Tech", international: true, remote: true },
  { id: "naukri", name: "Naukri", url: "https://www.naukri.com", type: "General", international: false, remote: true, region: "India" },
  { id: "github", name: "GitHub Jobs", url: "https://jobs.github.com", type: "Tech", international: true, remote: true },
  { id: "remoteok", name: "Remote OK", url: "https://remoteok.io", type: "Remote", international: true, remote: true },
  { id: "weworkremotely", name: "We Work Remotely", url: "https://weworkremotely.com", type: "Remote", international: true, remote: true },
  { id: "internshala", name: "Internshala", url: "https://internshala.com", type: "Internships", international: false, remote: true, region: "India" },
  { id: "dice", name: "Dice", url: "https://www.dice.com", type: "Tech", international: false, remote: true, region: "US" },
  { id: "dribbble", name: "Dribbble Jobs", url: "https://dribbble.com/jobs", type: "Tech", international: true, remote: true },
  { id: "stack-overflow", name: "Stack Overflow Jobs", url: "https://stackoverflow.com/jobs", type: "Tech", international: true, remote: true },
  { id: "company", name: "Company Career Pages", url: "#", type: "Company", international: true, remote: true },
];
