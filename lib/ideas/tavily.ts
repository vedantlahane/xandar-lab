interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

interface TavilyResponse {
  results?: TavilySearchResult[];
}

export async function searchTavily(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is missing. Add it to .env.local.");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 5,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily request failed (${response.status})`);
  }

  const data = (await response.json()) as TavilyResponse;
  return data.results ?? [];
}
