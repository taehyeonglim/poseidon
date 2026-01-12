/**
 * POSEIDON API Client
 * Connects frontend to backend API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
    }

    return response.json();
}

/**
 * Check API health
 */
export async function checkHealth() {
    return fetchAPI('/api/health');
}

/**
 * Get all journals with pagination
 */
export async function getJournals(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());

    const query = queryParams.toString();
    return fetchAPI(`/api/journals${query ? `?${query}` : ''}`);
}

/**
 * Get journal by ID
 */
export async function getJournalById(id) {
    return fetchAPI(`/api/journals/${encodeURIComponent(id)}`);
}

/**
 * Search journals with query and filters
 */
export async function searchJournals(query, filters = {}) {
    const response = await fetchAPI('/api/journals/search', {
        method: 'POST',
        body: JSON.stringify({
            query,
            filters,
            limit: 20,
            offset: 0,
        }),
    });

    // Map results to include fitScore, matchedTags, matchReason
    return response.results || [];
}

/**
 * Generate Captain's Brief for a journal
 */
export async function generateBrief(journalId, query = '') {
    return fetchAPI(`/api/journals/${encodeURIComponent(journalId)}/brief`, {
        method: 'POST',
        body: JSON.stringify({ query }),
    });
}

// ============ LEGACY MOCK FUNCTIONS FOR FALLBACK ============
// These use local data when backend is unavailable

import journals from '../data/mock_journals.json';
import trends from '../data/mock_trends.json';

/**
 * Calculate FitScore locally (fallback)
 */
function calculateFitScoreLocal(journal, query) {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 1);

    let score = 0;
    const matchedTags = [];

    journal.scopeTags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        queryTerms.forEach(term => {
            if (tagLower.includes(term) || term.includes(tagLower.substring(0, 4))) {
                score += 20;
                if (!matchedTags.includes(tag)) matchedTags.push(tag);
            }
        });
    });

    const nameDesc = (journal.name + ' ' + journal.description).toLowerCase();
    queryTerms.forEach(term => {
        if (nameDesc.includes(term)) {
            score += 10;
        }
    });

    // Deterministic variance based on id
    const variance = journal.id.charCodeAt(0) % 15;
    score = Math.min(100, Math.max(0, score + variance));

    return {
        score,
        matchedTags: matchedTags.slice(0, 3),
        matchReason: matchedTags.length > 0
            ? `${matchedTags[0]} 관련 연구에 적합`
            : '일반적 적합성'
    };
}

/**
 * Search journals with fallback to local mock data
 */
export async function searchJournalsWithFallback(query) {
    try {
        // Try backend first
        return await searchJournals(query);
    } catch (error) {
        console.warn('Backend unavailable, using local mock data:', error.message);

        // Fallback to local data
        if (!query || query.trim().length === 0) {
            return [];
        }

        const results = journals.map(journal => {
            const fit = calculateFitScoreLocal(journal, query);
            return {
                ...journal,
                fitScore: fit.score,
                matchedTags: fit.matchedTags,
                matchReason: fit.matchReason
            };
        });

        return results
            .filter(j => j.fitScore > 20)
            .sort((a, b) => b.fitScore - a.fitScore);
    }
}

/**
 * Get journal by ID with fallback
 */
export async function getJournalByIdWithFallback(id) {
    try {
        return await getJournalById(id);
    } catch (error) {
        console.warn('Backend unavailable, using local mock data:', error.message);

        const journal = journals.find(j => j.id === id);
        if (!journal) {
            throw new Error('저널을 찾을 수 없습니다');
        }

        const trendData = trends[id] || { keywords: [] };

        return {
            ...journal,
            trends: trendData.keywords
        };
    }
}

/**
 * Generate brief with fallback
 */
export async function generateBriefWithFallback(journalId, query = '') {
    try {
        return await generateBrief(journalId, query);
    } catch (error) {
        console.warn('Backend unavailable, using local mock data:', error.message);

        const journal = journals.find(j => j.id === journalId);
        if (!journal) {
            throw new Error('저널을 찾을 수 없습니다');
        }

        const trendData = trends[journalId] || { keywords: [] };
        const topKeywords = trendData.keywords.slice(0, 3);
        const hotTopic = topKeywords.find(k => k.growth > 40) || topKeywords[0];

        const brief = `
## ${journal.nameKo} 임무 브리핑

### 저널 개요
**${journal.name}**는 ${journal.discipline} 분야의 주요 학술지로, 영향력 지수 ${journal.impactFactor}을 기록하고 있습니다.

### 최근 연구 동향
${topKeywords.map(k => `- **${k.name}** (${k.nameEn}): 빈도 ${k.frequency}%, 성장률 ${k.growth > 0 ? '+' : ''}${k.growth}%`).join('\n')}

### 적합성 분석
${query ? `귀하의 연구 주제 "${query}"와 관련하여, ` : ''}이 저널은 ${journal.scopeTags.slice(0, 3).join(', ')} 분야의 연구를 적극적으로 게재하고 있습니다.

${hotTopic ? `특히 **${hotTopic.name}** 주제가 ${hotTopic.growth}% 성장률을 보이며 급부상하고 있어, 관련 연구 투고 시 좋은 기회가 될 수 있습니다.` : ''}

### 권장 사항
- 최신 호의 특집 주제를 확인하세요
- 저널의 투고 가이드라인을 숙지하세요
- 유사 논문의 인용 패턴을 분석하세요

---
*이 브리핑은 POSEIDON 시스템에서 자동 생성되었습니다.*
`.trim();

        return {
            journalId,
            journalName: journal.name,
            journalNameKo: journal.nameKo,
            brief,
            generatedAt: new Date().toISOString()
        };
    }
}
