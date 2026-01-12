import journals from '../data/mock_journals.json';
import trends from '../data/mock_trends.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate FitScore based on query match
function calculateFitScore(journal, query) {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 1);

    let score = 0;
    const matchedTags = [];

    // Check scope tags
    journal.scopeTags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        queryTerms.forEach(term => {
            if (tagLower.includes(term) || term.includes(tagLower.substring(0, 4))) {
                score += 20;
                if (!matchedTags.includes(tag)) matchedTags.push(tag);
            }
        });
    });

    // Check name and description
    const nameDesc = (journal.name + ' ' + journal.description).toLowerCase();
    queryTerms.forEach(term => {
        if (nameDesc.includes(term)) {
            score += 10;
        }
    });

    // Cap at 100
    score = Math.min(100, Math.max(0, score));

    // Add some variance for realism
    score = Math.min(100, score + Math.floor(Math.random() * 15));

    return {
        score,
        matchedTags: matchedTags.slice(0, 3),
        matchReason: matchedTags.length > 0
            ? `${matchedTags[0]} 관련 연구에 적합`
            : '일반적 적합성'
    };
}

// Search journals by query
export async function searchJournals(query) {
    await delay(300 + Math.random() * 200);

    if (!query || query.trim().length === 0) {
        return [];
    }

    const results = journals.map(journal => {
        const fit = calculateFitScore(journal, query);
        return {
            ...journal,
            fitScore: fit.score,
            matchedTags: fit.matchedTags,
            matchReason: fit.matchReason
        };
    });

    // Sort by fitScore descending, filter low scores
    return results
        .filter(j => j.fitScore > 20)
        .sort((a, b) => b.fitScore - a.fitScore);
}

// Get single journal by ID
export async function getJournalById(id) {
    await delay(200 + Math.random() * 100);

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

// Generate Captain's Brief in Korean
export async function generateBrief(journalId, query = '') {
    await delay(500 + Math.random() * 300);

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
