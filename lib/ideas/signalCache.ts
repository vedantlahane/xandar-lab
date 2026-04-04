import connectDB from "@/lib/db";
import SignalCache from "@/models/SignalCache";
import type { Signal } from "@/lib/ideas/types";

export async function getCachedSignals(domain: string): Promise<Signal[] | null> {
  await connectDB();
  const cached = await SignalCache.findOne({ domain }).lean();
  if (!cached) return null;

  // Manual expiration check just in case TTL index hasn't fired yet
  if (new Date() > cached.expiresAt) return null;

  return cached.signals as Signal[];
}

export async function setCachedSignals(domain: string, signals: Signal[]): Promise<void> {
  await connectDB();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12);

  await SignalCache.findOneAndUpdate(
    { domain },
    { signals, createdAt: new Date(), expiresAt },
    { upsert: true }
  );
}
