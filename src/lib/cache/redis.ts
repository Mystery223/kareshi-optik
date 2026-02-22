import { createClient } from "redis";

const CACHE_NAMESPACE = "kareshi";
const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_CACHE_TTL_SECONDS || "300");

type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as {
  redisClient?: RedisClient;
  redisUnavailableLogged?: boolean;
};

function getRedisUrl() {
  return process.env.REDIS_URL?.trim() || "";
}

async function getRedisClient() {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    if (!globalForRedis.redisUnavailableLogged) {
      console.warn("[REDIS_DISABLED] REDIS_URL is not set. Cache and rate limit are bypassed.");
      globalForRedis.redisUnavailableLogged = true;
    }
    return null;
  }

  if (globalForRedis.redisClient) return globalForRedis.redisClient;

  try {
    const client = createClient({ url: redisUrl });
    client.on("error", (error) => {
      console.error("[REDIS_ERROR]", error);
    });

    await client.connect();
    globalForRedis.redisClient = client;
    return client;
  } catch (error) {
    if (!globalForRedis.redisUnavailableLogged) {
      console.error("[REDIS_CONNECT_ERROR]", error);
      globalForRedis.redisUnavailableLogged = true;
    }
    return null;
  }
}

export function buildCacheKey(...parts: Array<string | number | boolean | null | undefined>) {
  const normalized = parts
    .filter((part) => part !== null && part !== undefined)
    .map((part) => String(part));
  return `${CACHE_NAMESPACE}:${normalized.join(":")}`;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("[REDIS_GET_CACHE_ERROR]", error);
    return null;
  }
}

export async function setCachedJson<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL_SECONDS) {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("[REDIS_SET_CACHE_ERROR]", error);
  }
}

export async function deleteCacheByPrefix(prefix: string) {
  try {
    const client = await getRedisClient();
    if (!client) return;

    const keysToDelete: string[] = [];
    for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
      keysToDelete.push(key);
    }

    if (keysToDelete.length > 0) {
      await client.del(keysToDelete);
    }
  } catch (error) {
    console.error("[REDIS_DELETE_PREFIX_ERROR]", error);
  }
}

export async function invalidateProductCaches() {
  await deleteCacheByPrefix(buildCacheKey("products"));
}

interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
  identifier?: string;
  channel?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
  current: number;
}

function getRateLimitWhitelist(): string[] {
  const envList = (process.env.REDIS_RATE_LIMIT_WHITELIST_IPS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    return Array.from(new Set([...envList, "127.0.0.1", "::1", "localhost"]));
  }

  return envList;
}

function isIdentifierWhitelisted(identifier?: string) {
  if (!identifier) return false;
  return getRateLimitWhitelist().includes(identifier);
}

export function logRateLimitBlocked(meta: {
  channel: string;
  key: string;
  identifier?: string;
  limit: number;
  windowSeconds: number;
  retryAfter: number;
  current: number;
}) {
  console.warn("[RATE_LIMIT_BLOCKED]", meta);
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  if (isIdentifierWhitelisted(options.identifier)) {
    return {
      allowed: true,
      remaining: options.limit,
      retryAfter: 0,
      current: 0,
    };
  }

  const client = await getRedisClient();
  if (!client) {
    return {
      allowed: true,
      remaining: options.limit,
      retryAfter: 0,
      current: 0,
    };
  }

  const cacheKey = buildCacheKey("ratelimit", options.key);
  const currentHits = await client.incr(cacheKey);
  if (currentHits === 1) {
    await client.expire(cacheKey, options.windowSeconds);
  }

  const ttl = await client.ttl(cacheKey);
  return {
    allowed: currentHits <= options.limit,
    remaining: Math.max(0, options.limit - currentHits),
    retryAfter: ttl > 0 ? ttl : options.windowSeconds,
    current: currentHits,
  };
}
