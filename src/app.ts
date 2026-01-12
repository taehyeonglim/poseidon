import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import journalRoutes from './routes/journal.routes';
import { rateLimiter } from './middleware/rate-limit';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Apply rate limiting to all API routes
    app.use('/api', rateLimiter.middleware());

    // API Routes
    app.use('/api', journalRoutes);

    // Root endpoint
    app.get('/', (_req: Request, res: Response) => {
        res.json({
            name: 'POSEIDON API',
            version: '0.1.0',
            endpoints: {
                health: 'GET /api/health',
                journals: 'GET /api/journals',
                journalById: 'GET /api/journals/:id',
                search: 'POST /api/journals/search',
                brief: 'POST /api/journals/:id/brief',
            },
        });
    });

    // 404 Handler
    app.use((_req: Request, res: Response) => {
        res.status(404).json({
            error: {
                code: 'NOT_FOUND',
                message: 'The requested endpoint does not exist',
            },
        });
    });

    // Error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Error:', err);
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
            },
        });
    });

    return app;
}

