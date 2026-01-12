import { CacheService } from '../../src/services/cache.service';

describe('CacheService', () => {
    let cache: CacheService;

    beforeEach(() => {
        cache = new CacheService(1); // 1 second TTL for testing
    });

    afterEach(() => {
        cache.clear();
    });

    describe('generateKey', () => {
        it('should generate key from prefix and params', () => {
            const key = cache.generateKey('test', { foo: 'bar', baz: 123 });
            expect(key).toContain('test:');
            expect(key).toContain('foo');
            expect(key).toContain('bar');
        });

        it('should generate consistent keys for same params', () => {
            const key1 = cache.generateKey('test', { a: 1, b: 2 });
            const key2 = cache.generateKey('test', { b: 2, a: 1 });
            expect(key1).toBe(key2);
        });

        it('should return prefix when no params', () => {
            const key = cache.generateKey('test');
            expect(key).toBe('test');
        });
    });

    describe('set and get', () => {
        it('should store and retrieve value', () => {
            cache.set('key1', 'value1');
            const result = cache.get<string>('key1');
            expect(result).toBe('value1');
        });

        it('should return null for non-existent key', () => {
            const result = cache.get('non-existent');
            expect(result).toBeNull();
        });

        it('should handle different data types', () => {
            cache.set('string', 'hello');
            cache.set('number', 42);
            cache.set('object', { foo: 'bar' });

            expect(cache.get('string')).toBe('hello');
            expect(cache.get('number')).toBe(42);
            expect(cache.get('object')).toEqual({ foo: 'bar' });
        });
    });

    describe('TTL expiration', () => {
        it('should return cached value before TTL expires', () => {
            cache.set('key1', 'value1', 10);
            const result = cache.get('key1');
            expect(result).toBe('value1');
        });

        it('should return null after TTL expires', async () => {
            cache.set('key1', 'value1', 0.1); // 100ms

            // Wait for expiration
            await new Promise((resolve) => setTimeout(resolve, 200));

            const result = cache.get('key1');
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should remove key from cache', () => {
            cache.set('key1', 'value1');
            const deleted = cache.delete('key1');

            expect(deleted).toBe(true);
            expect(cache.get('key1')).toBeNull();
        });

        it('should return false for non-existent key', () => {
            const deleted = cache.delete('non-existent');
            expect(deleted).toBe(false);
        });
    });

    describe('clear', () => {
        it('should remove all entries', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            cache.clear();

            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBeNull();
            expect(cache.getStats().size).toBe(0);
        });
    });

    describe('getStats', () => {
        it('should return cache statistics', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            const stats = cache.getStats();
            expect(stats.size).toBe(2);
            expect(stats.keys).toContain('key1');
            expect(stats.keys).toContain('key2');
        });
    });

    describe('cleanup', () => {
        it('should remove expired entries', async () => {
            cache.set('key1', 'value1', 0.1); // Expires quickly
            cache.set('key2', 'value2', 10); // Stays valid

            await new Promise((resolve) => setTimeout(resolve, 200));

            const removed = cache.cleanup();

            expect(removed).toBe(1);
            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBe('value2');
        });
    });
});
