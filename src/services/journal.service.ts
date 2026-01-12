import { IJournalProvider, Journal, QueryParams, Brief, QueryResponse } from '../providers';
import { cacheService } from './cache.service';

/**
 * Journal service with caching layer
 */
export class JournalService {
    constructor(private provider: IJournalProvider) { }

    /**
     * Get all journals with caching
     */
    async getAll(params?: { limit?: number; offset?: number }) {
        const cacheKey = cacheService.generateKey('journals:all', params);
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return { ...cached, cached: true };
        }

        const result = await this.provider.fetchAll(params);
        cacheService.set(cacheKey, result);

        return result;
    }

    /**
     * Get journal by ID with caching
     */
    async getById(id: string): Promise<Journal | null> {
        const cacheKey = cacheService.generateKey('journals:id', { id });
        const cached = cacheService.get<Journal>(cacheKey);

        if (cached) {
            return cached;
        }

        const result = await this.provider.fetchById(id);
        if (result) {
            cacheService.set(cacheKey, result);
        }

        return result;
    }

    /**
     * Search journals with caching
     */
    async search(params: QueryParams): Promise<QueryResponse<Journal>> {
        const cacheKey = cacheService.generateKey('journals:search', params as unknown as Record<string, unknown>);
        const cached = cacheService.get<QueryResponse<Journal>>(cacheKey);

        if (cached) {
            return { ...cached, cached: true };
        }

        const result = await this.provider.search(params);
        cacheService.set(cacheKey, result);

        return result;
    }

    /**
     * Generate brief for a journal
     */
    async generateBrief(journalId: string, query?: string): Promise<Brief> {
        // Briefs are not cached as they may vary based on context
        return this.provider.generateBrief(journalId, query);
    }

    /**
     * Get provider name
     */
    getProviderName(): string {
        return this.provider.getName();
    }
}
