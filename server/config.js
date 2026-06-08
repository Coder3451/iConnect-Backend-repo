import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iconnect',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd,
  cookieSecure: isProd,
  authRateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60_000,
  authRateLimitMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 30,
};

if (config.isProd && config.jwtSecret === 'dev-only-change-in-production') {
  console.warn('Warning: set JWT_SECRET in production.');
}
