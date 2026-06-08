import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import writingsRoutes from './routes/writings.js';
import { authRateLimiter } from './middleware/rateLimit.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.isProd ? false : true,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, name: 'iConnect' });
  });

  app.use('/api/auth', authRateLimiter, authRoutes);
  app.use('/api/writings', writingsRoutes);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
