import request from 'supertest';
import { createApp } from '../../src/app';
import { Application } from 'express';
import { cacheService } from '../../src/services/cache.service';

describe('API Integration Tests', () => {
    let app: Application;

    beforeAll(() => {
        process.env.PROVIDER_MODE = 'mock';
        app = createApp();
    });

    beforeEach(() => {
        // Clear cache before each test to prevent interference
        cacheService.clear();
    });

    describe('GET /', () => {
        it('should return API information', async () => {
            const response = await request(app).get('/');

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('POSEIDON API');
            expect(response.body.version).toBe('0.1.0');
            expect(response.body.endpoints).toBeDefined();
            expect(response.body.endpoints.journals).toBe('GET /api/journals');
        });
    });

    describe('GET /api/health', () => {
        it('should return 200 with status ok', async () => {
            const response = await request(app).get('/api/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
            expect(response.body.mode).toBe('mock');
            expect(response.body.timestamp).toBeDefined();
            expect(response.body.uptime).toBeDefined();
        });
    });

    describe('GET /api/journals', () => {
        it('should return paginated list of journals', async () => {
            const response = await request(app).get('/api/journals');

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.total).toBeGreaterThan(0);
            expect(response.body.pagination.hasMore).toBeDefined();
        });

        it('should support pagination parameters', async () => {
            const response = await request(app).get('/api/journals?limit=2&offset=0');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            expect(response.body.pagination.limit).toBe(2);
            expect(response.body.pagination.offset).toBe(0);
        });

        it('should return journal objects with correct schema', async () => {
            const response = await request(app).get('/api/journals?limit=1');

            expect(response.status).toBe(200);
            const journal = response.body.data[0];
            expect(journal.id).toBeDefined();
            expect(journal.name).toBeDefined();
            expect(journal.nameKo).toBeDefined();
            expect(journal.discipline).toBeDefined();
            expect(journal.impactFactor).toBeDefined();
            expect(journal.description).toBeDefined();
            expect(journal.scopeTags).toBeInstanceOf(Array);
        });

        it('should return deterministic data', async () => {
            const response1 = await request(app).get('/api/journals');
            cacheService.clear(); // Clear cache to test actual provider
            const response2 = await request(app).get('/api/journals');

            expect(response1.body.data.map((j: { id: string }) => j.id)).toEqual(
                response2.body.data.map((j: { id: string }) => j.id)
            );
        });
    });

    describe('GET /api/journals/:id', () => {
        it('should return journal by ID with trends', async () => {
            const response = await request(app).get('/api/journals/ijcscl');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('ijcscl');
            expect(response.body.name).toContain('Computer-Supported Collaborative Learning');
            expect(response.body.nameKo).toBeDefined();
            expect(response.body.trends).toBeInstanceOf(Array);
        });

        it('should return 404 for non-existent ID', async () => {
            const response = await request(app).get('/api/journals/non-existent');

            expect(response.status).toBe(404);
            expect(response.body.error.code).toBe('NOT_FOUND');
        });
    });

    describe('POST /api/journals/search', () => {
        it('should search journals by query', async () => {
            const response = await request(app)
                .post('/api/journals/search')
                .send({ query: 'collaborative learning' });

            expect(response.status).toBe(200);
            expect(response.body.results).toBeInstanceOf(Array);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.cached).toBeDefined();
        });

        it('should return journals with fitScore when searching', async () => {
            const response = await request(app)
                .post('/api/journals/search')
                .send({ query: 'AI education' });

            expect(response.status).toBe(200);
            if (response.body.results.length > 0) {
                const result = response.body.results[0];
                expect(result.fitScore).toBeDefined();
                expect(result.matchedTags).toBeInstanceOf(Array);
                expect(result.matchReason).toBeDefined();
            }
        });

        it('should support limit in search', async () => {
            const response = await request(app)
                .post('/api/journals/search')
                .send({ query: 'learning', limit: 2 });

            expect(response.status).toBe(200);
            expect(response.body.results.length).toBeLessThanOrEqual(2);
        });

        it('should return all journals when no query provided', async () => {
            const response = await request(app)
                .post('/api/journals/search')
                .send({});

            expect(response.status).toBe(200);
            expect(response.body.results).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/journals/:id/brief', () => {
        it('should generate brief for journal', async () => {
            const response = await request(app)
                .post('/api/journals/ijcscl/brief')
                .send({ query: 'collaborative learning AI' });

            expect(response.status).toBe(200);
            expect(response.body.journalId).toBe('ijcscl');
            expect(response.body.journalName).toBeDefined();
            expect(response.body.journalNameKo).toBeDefined();
            expect(response.body.brief).toBeDefined();
            expect(response.body.brief).toContain('임무 브리핑');
            expect(response.body.generatedAt).toBeDefined();
        });

        it('should return 404 for non-existent journal', async () => {
            const response = await request(app)
                .post('/api/journals/non-existent/brief')
                .send({});

            expect(response.status).toBe(404);
            expect(response.body.error.code).toBe('NOT_FOUND');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app).get('/api/unknown');

            expect(response.status).toBe(404);
            expect(response.body.error.code).toBe('NOT_FOUND');
        });
    });

    // === BACKWARDS COMPATIBILITY TESTS ===
    describe('Deprecated /api/data endpoints', () => {
        it('GET /api/data should return journals (deprecated)', async () => {
            const response = await request(app).get('/api/data');

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        });

        it('GET /api/data/:id should return journal (deprecated)', async () => {
            const response = await request(app).get('/api/data/ijcscl');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('ijcscl');
        });

        it('POST /api/data/query should search journals (deprecated)', async () => {
            const response = await request(app)
                .post('/api/data/query')
                .send({ query: 'learning' });

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });
});
