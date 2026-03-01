import { PORTALS } from "@/app/lab/jobs/data/portals";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
  const start = (page - 1) * pageSize;
  const slice = PORTALS.slice(start, start + pageSize);
  return new Response(JSON.stringify({ portals: slice, total: PORTALS.length }), {
    headers: { "Content-Type": "application/json" },
  });
}
