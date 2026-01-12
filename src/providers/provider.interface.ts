/**
 * Journal interface - unified schema for frontend and backend
 */
export interface Journal {
    id: string;
    name: string;
    nameKo: string;
    discipline: string;
    impactFactor: number;
    description: string;
    scopeTags: string[];
    // Optional fields added during search/analysis
    fitScore?: number;
    matchedTags?: string[];
    matchReason?: string;
    trends?: TrendKeyword[];
}

/**
 * Trend keyword for journal analytics
 */
export interface TrendKeyword {
    name: string;
    nameEn: string;
    frequency: number;
    growth: number;
}

/**
 * Query parameters for filtering journals
 */
export interface QueryParams {
    query?: string;
    filters?: {
        discipline?: string[];
        minImpactFactor?: number;
        maxImpactFactor?: number;
    };
    limit?: number;
    offset?: number;
}

/**
 * Response for paginated list operations
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

/**
 * Query response with results
 */
export interface QueryResponse<T> {
    results: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    cached: boolean;
}

/**
 * Brief generation result
 */
export interface Brief {
    journalId: string;
    journalName: string;
    journalNameKo: string;
    brief: string;
    generatedAt: string;
}

/**
 * Journal provider interface - all providers must implement this
 */
export interface IJournalProvider {
    /**
     * Fetch all journals with optional pagination
     */
    fetchAll(params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Journal>>;

    /**
     * Fetch a specific journal by ID
     * @returns Journal or null if not found
     */
    fetchById(id: string): Promise<Journal | null>;

    /**
     * Search journals with query and filters
     */
    search(params: QueryParams): Promise<QueryResponse<Journal>>;

    /**
     * Generate brief for a journal
     */
    generateBrief(journalId: string, query?: string): Promise<Brief>;

    /**
     * Get provider name (e.g., 'mock', 'arxiv')
     */
    getName(): string;
}
