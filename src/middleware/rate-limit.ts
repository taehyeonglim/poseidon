import { Request, Response, NextFunction } from 'express';

/**
 * Token bucket for rate limiting
 */
class TokenBucket {
    private tokens: number;
    private lastRefill: number;

    constructor(
        private maxTokens: number,
        private refillRate: number // tokens per second
    ) {
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }

    /**
     * Try to consume a token
     * Returns true if successful, false if rate limited
     */
    consume(): boolean {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }

        return false;
    }

    /**
     * Refill tokens based on time elapsed
     */
    private refill(): void {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000; // Convert to seconds
        const tokensToAdd = timePassed * this.refillRate;

        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }

    /**
     * Get time until next token is available (in seconds)
     */
    getRetryAfter(): number {
        if (this.tokens >= 1) return 0;
        return Math.ceil((1 - this.tokens) / this.refillRate);
    }
}

/**
 * Rate limiter middleware using token bucket algorithm
 */
export class RateLimiter {
    private buckets: Map<string, TokenBucket>;

    constructor(
        private maxRequests: number = 100,
        private windowSeconds: number = 60
    ) {
        this.buckets = new Map();
    }

    /**
     * Get identifier for rate limiting (IP address)
     */
    private getIdentifier(req: Request): string {
        return req.ip || req.socket.remoteAddress || 'unknown';
    }

    /**
     * Express middleware function
     */
    middleware() {
        return (req: Request, res: Response, next: NextFunction): void => {
            const identifier = this.getIdentifier(req);
            let bucket = this.buckets.get(identifier);

            if (!bucket) {
                const refillRate = this.maxRequests / this.windowSeconds;
                bucket = new TokenBucket(this.maxRequests, refillRate);
                this.buckets.set(identifier, bucket);
            }

            if (bucket.consume()) {
                next();
            } else {
                const retryAfter = bucket.getRetryAfter();
                res.setHeader('Retry-After', retryAfter.toString());
                res.status(429).json({
                    error: 'Too many requests',
                    message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
                    retryAfter,
                });
            }
        };
    }

    /**
     * Clean up old buckets (optional maintenance)
     */
    cleanup(): void {
        // In production, might want to add timestamp tracking
        // and remove buckets that haven't been used recently
        // For now, keep it simple
    }
}

// Default rate limiter: 100 requests per 60 seconds
export const rateLimiter = new RateLimiter(100, 60);
