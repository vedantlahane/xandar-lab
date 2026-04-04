import { ChatOpenAI } from "@langchain/openai";
import type { AIMessageChunk, BaseMessageLike } from "@langchain/core/messages";

function extractText(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

function extractJsonText(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const startObj = raw.indexOf("{");
  const startArr = raw.indexOf("[");

  const starts = [startObj, startArr].filter((idx) => idx >= 0);
  if (starts.length === 0) return raw.trim();

  const start = Math.min(...starts);
  const opening = raw[start];
  const closing = opening === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < raw.length; i += 1) {
    const ch = raw[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === opening) depth += 1;
    if (ch === closing) {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(start, i + 1).trim();
      }
    }
  }

  return raw.slice(start).trim();
}

export function createIdeaForgeModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local.");
  }

  return new ChatOpenAI({
    apiKey,
    model: process.env.IDEAFORGE_OPENAI_MODEL ?? "gpt-4o",
    temperature: 0.4,
  });
}

export async function invokeJsonModel<T>(params: {
  messages: BaseMessageLike[];
  fallback: T;
}): Promise<{ data: T; rawText: string; usedFallback: boolean; error?: string }> {
  try {
    const model = createIdeaForgeModel();
    const response = (await model.invoke(params.messages)) as AIMessageChunk;
    const text = extractText(response.content);
    const jsonText = extractJsonText(text);
    const parsed = JSON.parse(jsonText) as T;

    return {
      data: parsed,
      rawText: text,
      usedFallback: false,
    };
  } catch (error) {
    return {
      data: params.fallback,
      rawText: "",
      usedFallback: true,
      error: error instanceof Error ? error.message : "Unknown LLM error",
    };
  }
}
