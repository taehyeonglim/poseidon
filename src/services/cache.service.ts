/**
 * Cache entry with TTL
 */
interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

/**
 * In-memory cache service with TTL support
 */
export class CacheService {
    private cache: Map<string, CacheEntry<unknown>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 300) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL; // Default 5 minutes
    }

    /**
     * Generate cache key from request parameters
     */
    generateKey(prefix: string, params?: Record<string, unknown>): string {
        if (!params) return prefix;
        const sortedParams = JSON.stringify(params, Object.keys(params).sort());
        return `${prefix}:${sortedParams}`;
    }

    /**
     * Get value from cache
     * Returns null if not found or expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Set value in cache with optional TTL
     */
    set<T>(key: string, value: T, ttl?: number): void {
        const ttlToUse = ttl !== undefined ? ttl : this.defaultTTL;
        const expiresAt = Date.now() + ttlToUse * 1000; // Convert to milliseconds

        this.cache.set(key, {
            value,
            expiresAt,
        });
    }

    /**
     * Delete specific key from cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }

    /**
     * Clean up expired entries
     */
    cleanup(): number {
        let removed = 0;
        const now = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                removed++;
            }
        }

        return removed;
    }
}

// Singleton instance
export const cacheService = new CacheService(
    parseInt(process.env.CACHE_TTL || '300', 10)
);
