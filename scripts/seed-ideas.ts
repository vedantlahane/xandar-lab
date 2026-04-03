// scripts/seed-ideas.ts
// Usage:
//   npx tsx scripts/seed-ideas.ts
//   npx tsx scripts/seed-ideas.ts --domain=developer-tools
//   npx tsx scripts/seed-ideas.ts --all

import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "");

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function normalizeDomain(raw: string) {
  const value = raw.trim().toLowerCase();

  if (value === "devtools") return "developer-tools";
  if (value === "aiml") return "ai-ml-tools";

  return value;
}

async function main() {
  loadEnvLocal();

  const { runScheduledGeneration, SCHEDULED_DOMAINS } = await import("../lib/ideaforge/scheduler");

  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const domainArg = args.find((arg) => arg.startsWith("--domain="));

  let domains: string[];

  if (all) {
    domains = [...SCHEDULED_DOMAINS];
  } else if (domainArg) {
    const domain = normalizeDomain(domainArg.replace("--domain=", ""));
    domains = [domain];
  } else {
    domains = ["developer-tools", "ai-ml-tools", "devops"];
  }

  const invalid = domains.filter((domain) => !SCHEDULED_DOMAINS.includes(domain as any));
  if (invalid.length > 0) {
    console.error(`Invalid domain(s): ${invalid.join(", ")}`);
    console.error(`Valid domains: ${SCHEDULED_DOMAINS.join(", ")}`);
    process.exit(1);
  }

  console.log("Starting idea seed generation...");
  console.log(`Domains: ${domains.join(", ")}`);

  const started = Date.now();
  const summary = await runScheduledGeneration({ domains });
  const durationSec = Math.round((Date.now() - started) / 1000);

  console.log("\nSeed complete.");
  console.log(`Duration: ${durationSec}s`);
  console.log(`Ideas generated: ${summary.ideasGenerated}`);
  console.log(`Ideas saved: ${summary.ideasSaved}`);
  console.log(`Duplicates skipped: ${summary.duplicatesSkipped}`);

  if (summary.failedDomains.length > 0) {
    console.log(`Failed domains: ${summary.failedDomains.join(", ")}`);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Seed ideas failed", error);
  process.exit(1);
});
