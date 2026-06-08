import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import writingsRoutes from './routes/writings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const app = express();

app.use(
  cors({
    origin: config.isProd ? false : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/writings', writingsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'iConnect' });
});

app.use(express.static(publicDir));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`iConnect running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
