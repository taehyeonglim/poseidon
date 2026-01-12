import {
    Journal,
    IJournalProvider,
    PaginatedResponse,
    QueryParams,
    QueryResponse,
    Brief,
    TrendKeyword,
} from './provider.interface';

/**
 * Mock journal data - mirrors frontend mock_journals.json
 */
const MOCK_JOURNALS: Journal[] = [
    {
        id: 'ijcscl',
        name: 'International Journal of Computer-Supported Collaborative Learning',
        nameKo: '국제 컴퓨터 지원 협력 학습 저널',
        discipline: 'Learning Sciences',
        impactFactor: 4.2,
        description: 'Leading journal in CSCL research, focusing on technology-enhanced collaborative learning environments.',
        scopeTags: ['collaborative learning', 'CSCL', 'educational technology', 'social learning', 'AI in education'],
    },
    {
        id: 'jls',
        name: 'Journal of the Learning Sciences',
        nameKo: '학습 과학 저널',
        discipline: 'Learning Sciences',
        impactFactor: 5.1,
        description: 'Premier venue for learning sciences research spanning cognitive, social, and design perspectives.',
        scopeTags: ['learning sciences', 'cognition', 'design-based research', 'situated learning', 'knowledge building'],
    },
    {
        id: 'etrd',
        name: 'Educational Technology Research and Development',
        nameKo: '교육 기술 연구 개발',
        discipline: 'Educational Technology',
        impactFactor: 3.8,
        description: 'Research on design, development, and evaluation of instructional technologies.',
        scopeTags: ['instructional design', 'educational technology', 'e-learning', 'multimedia learning', 'assessment'],
    },
    {
        id: 'comped',
        name: 'Computers & Education',
        nameKo: '컴퓨터와 교육',
        discipline: 'Educational Technology',
        impactFactor: 8.9,
        description: 'High-impact journal covering all aspects of computing in educational contexts.',
        scopeTags: ['educational technology', 'learning analytics', 'online learning', 'AI in education', 'digital literacy'],
    },
    {
        id: 'bjet',
        name: 'British Journal of Educational Technology',
        nameKo: '영국 교육 기술 저널',
        discipline: 'Educational Technology',
        impactFactor: 4.7,
        description: 'International journal on technology-enhanced teaching and learning research.',
        scopeTags: ['technology-enhanced learning', 'pedagogy', 'teacher education', 'digital tools', 'assessment'],
    },
    {
        id: 'ile',
        name: 'Interactive Learning Environments',
        nameKo: '상호작용 학습 환경',
        discipline: 'Learning Sciences',
        impactFactor: 3.2,
        description: 'Research on interactive and adaptive learning systems and environments.',
        scopeTags: ['adaptive learning', 'intelligent tutoring', 'simulation', 'game-based learning', 'virtual reality'],
    },
    {
        id: 'jcal',
        name: 'Journal of Computer Assisted Learning',
        nameKo: '컴퓨터 보조 학습 저널',
        discipline: 'Educational Technology',
        impactFactor: 4.0,
        description: 'Research on computer-based learning technologies and their applications.',
        scopeTags: ['computer-assisted learning', 'mobile learning', 'blended learning', 'personalization', 'feedback'],
    },
    {
        id: 'lti',
        name: 'Learning, Media and Technology',
        nameKo: '학습, 미디어, 기술',
        discipline: 'Media & Education',
        impactFactor: 3.5,
        description: 'Critical perspectives on media and technology in learning contexts.',
        scopeTags: ['media literacy', 'critical pedagogy', 'social media', 'digital culture', 'informal learning'],
    },
    {
        id: 'aied',
        name: 'International Journal of Artificial Intelligence in Education',
        nameKo: '국제 인공지능 교육 저널',
        discipline: 'AI in Education',
        impactFactor: 4.9,
        description: 'AI and machine learning applications in educational settings.',
        scopeTags: ['AI in education', 'intelligent tutoring systems', 'learning analytics', 'natural language processing', 'adaptive learning'],
    },
    {
        id: 'jrst',
        name: 'Journal of Research in Science Teaching',
        nameKo: '과학 교육 연구 저널',
        discipline: 'Science Education',
        impactFactor: 4.6,
        description: 'Leading journal for research on science teaching and learning.',
        scopeTags: ['science education', 'inquiry learning', 'conceptual change', 'STEM', 'argumentation'],
    },
    {
        id: 'tlt',
        name: 'IEEE Transactions on Learning Technologies',
        nameKo: 'IEEE 학습 기술 논문지',
        discipline: 'Educational Technology',
        impactFactor: 3.7,
        description: 'Technical research on learning technologies and their engineering.',
        scopeTags: ['learning technologies', 'learning management systems', 'educational data mining', 'standards', 'interoperability'],
    },
    {
        id: 'ijed',
        name: 'International Journal of Educational Development',
        nameKo: '국제 교육 개발 저널',
        discipline: 'Education Policy',
        impactFactor: 2.8,
        description: 'Research on educational development in global contexts.',
        scopeTags: ['education policy', 'development', 'equity', 'access', 'global education'],
    },
];

/**
 * Mock trend data for journals
 */
const MOCK_TRENDS: Record<string, TrendKeyword[]> = {
    ijcscl: [
        { name: '협력 학습', nameEn: 'Collaborative Learning', frequency: 45, growth: 12 },
        { name: 'AI 튜터링', nameEn: 'AI Tutoring', frequency: 32, growth: 48 },
        { name: '학습 분석', nameEn: 'Learning Analytics', frequency: 28, growth: 15 },
    ],
    jls: [
        { name: '지식 구축', nameEn: 'Knowledge Building', frequency: 38, growth: 8 },
        { name: '디자인 기반 연구', nameEn: 'Design-Based Research', frequency: 35, growth: 5 },
        { name: '상황 학습', nameEn: 'Situated Learning', frequency: 25, growth: -3 },
    ],
    comped: [
        { name: '생성형 AI', nameEn: 'Generative AI', frequency: 52, growth: 85 },
        { name: '학습 분석', nameEn: 'Learning Analytics', frequency: 41, growth: 22 },
        { name: '온라인 학습', nameEn: 'Online Learning', frequency: 38, growth: 10 },
    ],
    aied: [
        { name: 'LLM 교육', nameEn: 'LLM in Education', frequency: 48, growth: 120 },
        { name: '적응형 학습', nameEn: 'Adaptive Learning', frequency: 35, growth: 18 },
        { name: '자동 평가', nameEn: 'Automated Assessment', frequency: 30, growth: 25 },
    ],
};

/**
 * Mock journal provider with deterministic outputs
 * No external API calls - perfect for testing
 */
export class MockProvider implements IJournalProvider {
    getName(): string {
        return 'mock';
    }

    async fetchAll(params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Journal>> {
        const limit = params?.limit || 50;
        const offset = params?.offset || 0;

        const paginatedData = MOCK_JOURNALS.slice(offset, offset + limit);
        const total = MOCK_JOURNALS.length;

        return {
            data: paginatedData,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        };
    }

    async fetchById(id: string): Promise<Journal | null> {
        const journal = MOCK_JOURNALS.find((j) => j.id === id);
        if (!journal) return null;

        // Add trends if available
        const trends = MOCK_TRENDS[id] || [];
        return { ...journal, trends };
    }

    async search(params: QueryParams): Promise<QueryResponse<Journal>> {
        let results = [...MOCK_JOURNALS];
        const query = params.query?.toLowerCase() || '';

        // Search by query
        if (query) {
            results = results.map((journal) => {
                const fit = this.calculateFitScore(journal, query);
                return { ...journal, ...fit };
            }).filter((j) => j.fitScore && j.fitScore > 20);

            // Sort by fitScore descending
            results.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
        }

        // Apply discipline filter
        if (params.filters?.discipline?.length) {
            results = results.filter((j) =>
                params.filters!.discipline!.includes(j.discipline)
            );
        }

        // Apply impact factor filters
        if (params.filters?.minImpactFactor !== undefined) {
            results = results.filter((j) => j.impactFactor >= params.filters!.minImpactFactor!);
        }
        if (params.filters?.maxImpactFactor !== undefined) {
            results = results.filter((j) => j.impactFactor <= params.filters!.maxImpactFactor!);
        }

        // Apply pagination
        const limit = params.limit || 20;
        const offset = params.offset || 0;
        const total = results.length;
        const paginatedResults = results.slice(offset, offset + limit);

        return {
            results: paginatedResults,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
            cached: false,
        };
    }

    async generateBrief(journalId: string, query?: string): Promise<Brief> {
        const journal = await this.fetchById(journalId);
        if (!journal) {
            throw new Error(`Journal with id '${journalId}' not found`);
        }

        const trends = journal.trends || MOCK_TRENDS[journalId] || [];
        const topKeywords = trends.slice(0, 3);
        const hotTopic = topKeywords.find((k) => k.growth > 40) || topKeywords[0];

        const brief = `
## ${journal.nameKo} 임무 브리핑

### 저널 개요
**${journal.name}**는 ${journal.discipline} 분야의 주요 학술지로, 영향력 지수 ${journal.impactFactor}을 기록하고 있습니다.

### 최근 연구 동향
${topKeywords.map((k) => `- **${k.name}** (${k.nameEn}): 빈도 ${k.frequency}%, 성장률 ${k.growth > 0 ? '+' : ''}${k.growth}%`).join('\n')}

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
            generatedAt: new Date().toISOString(),
        };
    }

    private calculateFitScore(journal: Journal, query: string): { fitScore: number; matchedTags: string[]; matchReason: string } {
        const queryTerms = query.split(/\s+/).filter((t) => t.length > 1);
        let score = 0;
        const matchedTags: string[] = [];

        // Check scope tags
        journal.scopeTags.forEach((tag) => {
            const tagLower = tag.toLowerCase();
            queryTerms.forEach((term) => {
                if (tagLower.includes(term) || term.includes(tagLower.substring(0, 4))) {
                    score += 20;
                    if (!matchedTags.includes(tag)) matchedTags.push(tag);
                }
            });
        });

        // Check name and description
        const nameDesc = (journal.name + ' ' + journal.description).toLowerCase();
        queryTerms.forEach((term) => {
            if (nameDesc.includes(term)) {
                score += 10;
            }
        });

        // Cap at 100, add small variance for realism (deterministic based on id)
        const variance = journal.id.charCodeAt(0) % 15;
        score = Math.min(100, Math.max(0, score + variance));

        return {
            fitScore: score,
            matchedTags: matchedTags.slice(0, 3),
            matchReason: matchedTags.length > 0
                ? `${matchedTags[0]} 관련 연구에 적합`
                : '일반적 적합성',
        };
    }
}

