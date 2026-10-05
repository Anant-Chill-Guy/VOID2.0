import crypto from 'node:crypto';
import { config } from './config.js';

const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', config.authSecret).update(body).digest('base64url');
  return `${body}.${sig}`;
};

export const verifyToken = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;

  const expected = crypto.createHmac('sha256', config.authSecret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (payload.role !== 'admin') return null;
  if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
  return payload;
};

export const issueAdminToken = () => {
  const now = Date.now();
  return sign({ role: 'admin', iat: now, exp: now + config.tokenTtlMs });
};

const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};


const attempts = new Map();
const RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };

const rateLimited = (ip) => {
  const now = Date.now();
  
  if (attempts.size > 1000) {
    for (const [key, rec] of attempts) {
      if (rec.resetAt < now) attempts.delete(key);
    }
  }
  const rec = attempts.get(ip);
  if (!rec || rec.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { allowed: true };
  }
  rec.count += 1;
  if (rec.count > RATE_LIMIT.max) {
    return { allowed: false };
  }
  return { allowed: true };
};

export const loginHandler = (req, res) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  if (!rateLimited(ip).allowed) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  const { password } = req.body || {};
  if (typeof password !== 'string' || !safeEqual(password, config.adminPassword)) {
    return res.status(401).json({ error: 'Access denied.' });
  }
  return res.json({ token: issueAdminToken() });
};

export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
};
