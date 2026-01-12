import { Router, Request, Response } from 'express';
import { JournalService } from '../services/journal.service';
import { createProvider } from '../providers';

const router = Router();

// Initialize provider and service
const providerMode = process.env.PROVIDER_MODE || 'mock';
const provider = createProvider(providerMode);
const journalService = new JournalService(provider);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        mode: journalService.getProviderName(),
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

/**
 * GET /api/journals
 * List all journals with pagination
 */
router.get('/journals', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

        const result = await journalService.getAll({ limit, offset });
        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

/**
 * GET /api/journals/:id
 * Get specific journal by ID
 */
router.get('/journals/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await journalService.getById(id);

        if (!result) {
            res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Journal with id '${id}' not found`,
                },
            });
            return;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

/**
 * POST /api/journals/search
 * Search journals with query and filters
 */
router.post('/journals/search', async (req: Request, res: Response) => {
    try {
        const queryParams = req.body;
        const results = await journalService.search(queryParams);

        res.json(results);
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

/**
 * POST /api/journals/:id/brief
 * Generate Captain's Brief for a journal
 */
router.post('/journals/:id/brief', async (req: Request, res: Response) => {
    try {
        const journalId = req.params.id as string;
        const query = typeof req.body.query === 'string' ? req.body.query : undefined;

        const brief = await journalService.generateBrief(journalId, query);
        res.json(brief);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: error.message,
                },
            });
            return;
        }

        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

// ============ BACKWARDS COMPATIBILITY ============
// Keep /api/data endpoints for compatibility during migration

/**
 * @deprecated Use /api/journals instead
 */
router.get('/data', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

        const result = await journalService.getAll({ limit, offset });
        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

/**
 * @deprecated Use /api/journals/:id instead
 */
router.get('/data/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await journalService.getById(id);

        if (!result) {
            res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Data item with id '${id}' not found`,
                },
            });
            return;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

/**
 * @deprecated Use /api/journals/search instead
 */
router.post('/data/query', async (req: Request, res: Response) => {
    try {
        const queryParams = req.body;
        const results = await journalService.search(queryParams);

        // Transform to old format for compatibility
        res.json({
            data: results.results,
            query: queryParams,
        });
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
});

export default router;
