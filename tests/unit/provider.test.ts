import { MockProvider } from '../../src/providers/mock.provider';

describe('MockProvider', () => {
    let provider: MockProvider;

    beforeEach(() => {
        provider = new MockProvider();
    });

    describe('getName', () => {
        it('should return "mock"', () => {
            expect(provider.getName()).toBe('mock');
        });
    });

    describe('fetchAll', () => {
        it('should return deterministic array of data items', async () => {
            const result = await provider.fetchAll();

            expect(result.data).toHaveLength(5);
            expect(result.pagination.total).toBe(5);
            expect(result.data[0].id).toBe('mock-001');
            expect(result.data[0].value).toBe(42.5);
        });

        it('should support pagination', async () => {
            const result = await provider.fetchAll({ limit: 2, offset: 0 });

            expect(result.data).toHaveLength(2);
            expect(result.pagination.page).toBe(1);
            expect(result.pagination.limit).toBe(2);
            expect(result.data[0].id).toBe('mock-001');
        });

        it('should return same data on multiple calls (deterministic)', async () => {
            const result1 = await provider.fetchAll();
            const result2 = await provider.fetchAll();

            expect(result1).toEqual(result2);
        });
    });

    describe('fetchById', () => {
        it('should return consistent item for same ID', async () => {
            const result1 = await provider.fetchById('mock-001');
            const result2 = await provider.fetchById('mock-001');

            expect(result1).toEqual(result2);
            expect(result1?.name).toBe('Sample Item 1');
            expect(result1?.value).toBe(42.5);
        });

        it('should return null for non-existent ID', async () => {
            const result = await provider.fetchById('non-existent');
            expect(result).toBeNull();
        });

        it('should return different items for different IDs', async () => {
            const item1 = await provider.fetchById('mock-001');
            const item2 = await provider.fetchById('mock-002');

            expect(item1?.id).toBe('mock-001');
            expect(item2?.id).toBe('mock-002');
            expect(item1).not.toEqual(item2);
        });
    });

    describe('query', () => {
        it('should filter by type', async () => {
            const results = await provider.query({ filters: { type: 'sample' } });

            expect(results.length).toBe(3);
            results.forEach((item) => {
                expect(item.type).toBe('sample');
            });
        });

        it('should support limit', async () => {
            const results = await provider.query({ limit: 2 });

            expect(results).toHaveLength(2);
        });

        it('should support offset', async () => {
            const results = await provider.query({ offset: 2, limit: 2 });

            expect(results).toHaveLength(2);
            expect(results[0].id).toBe('mock-003');
        });

        it('should return empty array when no matches', async () => {
            const results = await provider.query({ filters: { type: 'non-existent' } });

            expect(results).toEqual([]);
        });
    });
});
