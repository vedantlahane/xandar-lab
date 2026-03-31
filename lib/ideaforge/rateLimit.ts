const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

type RateRecord = {
  count: number;
  resetAt: number;
};

const requestMap = new Map<string, RateRecord>();

export function getRateLimitStatus(key: string) {
  const now = Date.now();
  const existing = requestMap.get(key);

  if (!existing || now > existing.resetAt) {
    const record: RateRecord = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    requestMap.set(key, record);

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt: record.resetAt,
    };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  requestMap.set(key, existing);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - existing.count,
    resetAt: existing.resetAt,
  };
}
