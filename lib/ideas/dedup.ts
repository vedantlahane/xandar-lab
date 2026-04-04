import Idea from "@/models/Idea";
import { invokeJsonModel } from "@/lib/ideas/llm";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function isDuplicateIdea(
  newIdea: { title: string; problem: string; solution: string },
  domain: string
): Promise<{ duplicate: boolean; matchedTitle?: string; reason?: string }> {
  // Step 1: Fast check - fetch recent ideas for domain
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentIdeas = await Idea.find({
    domain,
    createdAt: { $gte: ninetyDaysAgo }
  })
    .select("title problem solution")
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  if (recentIdeas.length === 0) return { duplicate: false };

  const stopWords = new Set(["a", "the", "for", "with", "and", "tool", "app", "platform", "of", "in", "to", "is", "on", "that", "this"]);
  
  function getSignificantWords(text: string) {
    return text.toLowerCase().split(/\W+/).filter(w => !stopWords.has(w) && w.length > 2);
  }

  const newWords = getSignificantWords(newIdea.title);
  const potentialMatches = [];

  for (const existing of recentIdeas) {
    const existingWords = getSignificantWords(existing.title);
    
    let matchCount = 0;
    for (const w of newWords) {
      if (existingWords.includes(w)) matchCount++;
    }

    const overlapRatio = matchCount / Math.max(newWords.length, 1);
    
    // Flag if 60% of words overlap or more than 3 significant words are shared
    if (overlapRatio >= 0.6 || matchCount > 3) {
      potentialMatches.push(existing);
    }
  }

  if (potentialMatches.length === 0) return { duplicate: false };

  // Step 2: LLM Semantic Verification
  const systemPrompt = `You are a duplicate idea detector. Compare a NEW idea against EXISTING ideas and determine if the new idea is essentially the same concept — solving the same problem for the same users in the same way — even if worded differently.

Two ideas are duplicates if a user browsing them would think 'these are the same thing'. They are NOT duplicates if they solve similar problems but with meaningfully different approaches, target different users, or have different core value propositions.

Return JSON: { "duplicate": boolean, "matchedTitle": string | null, "reason": string }`;

  const userPrompt = `NEW IDEA:
Title: ${newIdea.title}
Problem: ${newIdea.problem}
Solution: ${newIdea.solution}

POTENTIAL MATCHES:
${potentialMatches.map((m, i) => `[${i + 1}] Title: ${m.title}
Problem: ${m.problem}
Solution: ${m.solution}`).join('\n\n')}

Analyze if the NEW IDEA is a semantic duplicate of any of the POTENTIAL MATCHES.`;

  const result = await invokeJsonModel<{ duplicate: boolean, matchedTitle: string | null, reason: string }>({
    messages: [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt)
    ],
    fallback: { duplicate: false, matchedTitle: null, reason: "Fallback" }
  });

  return {
    duplicate: result.data.duplicate,
    matchedTitle: result.data.matchedTitle || undefined,
    reason: result.data.reason
  };
}
