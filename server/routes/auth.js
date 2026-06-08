import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { clearAuthCookie, requireAuth, setAuthCookie, signToken } from '../middleware/auth.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalized = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: normalized,
      passwordHash,
      name: typeof name === 'string' ? name.trim() : '',
    });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: { id: req.user._id, email: req.user.email, name: req.user.name },
  });
});

export default router;
