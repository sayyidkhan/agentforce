import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import duelRoutes from './routes/duel';
import { contextService } from './services/context';
import { duelEvents, DuelEvent } from './services/duelEvents';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3001;

const sessionSubscriptions = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws) => {
  let subscribedSession: string | null = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'subscribe' && msg.sessionId) {
        subscribedSession = msg.sessionId;
        if (!sessionSubscriptions.has(msg.sessionId)) {
          sessionSubscriptions.set(msg.sessionId, new Set());
        }
        sessionSubscriptions.get(msg.sessionId)!.add(ws);
        ws.send(JSON.stringify({ type: 'subscribed', sessionId: msg.sessionId }));
      }
    } catch { /* ignore malformed messages */ }
  });

  ws.on('close', () => {
    if (subscribedSession) {
      sessionSubscriptions.get(subscribedSession)?.delete(ws);
    }
  });
});

duelEvents.on('duel:progress', (event: DuelEvent) => {
  const clients = sessionSubscriptions.get(event.sessionId);
  if (!clients) return;
  const payload = JSON.stringify({ type: 'progress', ...event });
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/duel', duelRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'DevDuel Agent API',
    version: '1.0.0',
    description: 'Anime-style 1v1 Professional Profile Battle System',
    endpoints: {
      'POST /api/duel/start': 'Start a new duel with two profile URLs',
      'GET /api/duel/:id': 'Get duel result by ID',
      'GET /api/duel/:id/status': 'Get duel processing status',
      'GET /api/duel/health': 'Health check for all services',
    },
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Initialize services and start server
async function start() {
  try {
    // Initialize context service
    await contextService.initialize();
    console.log('[Server] Context service initialized');

    server.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚔️  DevDuel Agent API Server  ⚔️                        ║
║                                                           ║
║   Server running on http://localhost:${PORT}               ║
║                                                           ║
║   Ready for epic anime battles!                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();
