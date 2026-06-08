import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User } from '../models/User.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });
}

export async function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie('token', { path: '/', httpOnly: true, secure: config.cookieSecure, sameSite: 'lax' });
}
