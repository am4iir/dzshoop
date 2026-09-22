const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
  return ip || "anonymous";
}

export function checkRateLimit(request: Request, options?: { maxRequests?: number; windowMs?: number }) {
  const maxRequests = options?.maxRequests ?? MAX_REQUESTS;
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const key = getClientIdentifier(request);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, bucket.resetAt - now) };
  }

  bucket.count += 1;
  return { allowed: true, remaining: maxRequests - bucket.count };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
