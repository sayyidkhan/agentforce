import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { duelOrchestrator } from '../orchestrator/pipeline';
import { contextService } from '../services/context';
import { duelEvents } from '../services/duelEvents';

const router = Router();

const startDuelSchema = z.object({
  url1: z.string().url('Invalid URL for profile 1'),
  url2: z.string().url('Invalid URL for profile 2'),
});

/**
 * POST /api/duel/start
 * Creates a session, returns the ID immediately, and runs the pipeline in the background.
 * The client subscribes via WebSocket to receive real-time progress events,
 * then fetches GET /api/duel/:id when the 'complete' event arrives.
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const validation = startDuelSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid request',
        details: validation.error.issues,
      });
      return;
    }

    const { url1, url2 } = validation.data;
    console.log(`[API] Starting duel: ${url1} vs ${url2}`);

    const session = await contextService.createDuelSession(url1, url2);

    res.json({ id: session.id, status: 'pending' });

    duelOrchestrator.runDuel(url1, url2, session.id).catch((error) => {
      console.error('[API] Background duel failed:', error);
      duelEvents.broadcast(session.id, 'error', error instanceof Error ? error.message : 'Unknown error', 0);
    });
  } catch (error) {
    console.error('[API] Duel start error:', error);
    res.status(500).json({
      error: 'Failed to process duel',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/duel/:id
 * Get duel result by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await duelOrchestrator.getDuelResult(id);

    if (!result) {
      res.status(404).json({
        error: 'Duel not found',
        message: `No duel found with ID: ${id}`,
      });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('[API] Get duel error:', error);
    res.status(500).json({
      error: 'Failed to retrieve duel',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/duel/:id/status
 * Get duel processing status and progress
 */
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const status = await duelOrchestrator.getDuelStatus(id);

    res.json(status);
  } catch (error) {
    console.error('[API] Get status error:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: 'Duel not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to retrieve status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/duel/health
 * Health check for all services
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await duelOrchestrator.healthCheck();
    
    const allHealthy = Object.values(health).every(Boolean);
    
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      services: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
