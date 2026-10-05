import { Router } from 'express';
import { query } from './db.js';
import { validateRegistration } from './validate.js';
import { loginHandler, requireAdmin } from './auth.js';

export const router = Router();



const parseDomains = (body) => {
  const list = Array.isArray(body.domains)
    ? body.domains
    : body.domain
      ? [body.domain]
      : [];
  return list.map((d) => String(d).trim()).filter(Boolean);
};


router.post('/register', async (req, res) => {
  const fields = {
    name: (req.body.name || '').trim(),
    branch: (req.body.branch || '').trim(),
    year: (req.body.year || '').trim(),
    email: String(req.body.email || '').trim().toLowerCase(),
    whatsapp: (req.body.whatsapp || '').trim(),
    accommodation: (req.body.accommodation || '').trim(),
    domains: parseDomains(req.body),
  };

  const errors = validateRegistration(fields);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  const [domain, domain2, domain3] = [
    fields.domains[0] ?? null,
    fields.domains[1] ?? null,
    fields.domains[2] ?? null,
  ];

  try {
    const result = await query(
      `INSERT INTO registrations (name, branch, year, email, whatsapp, accommodation, domain, domain2, domain3)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [fields.name, fields.branch, fields.year, fields.email, fields.whatsapp, fields.accommodation, domain, domain2, domain3],
    );
    if (!result.rowCount) {
      return res.status(409).json({ errors: { email: 'This email is already registered.' } });
    }
    return res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('register insert failed:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


router.post('/admin/login', loginHandler);
router.get('/admin/verify', requireAdmin, (_req, res) => res.json({ valid: true }));


router.get('/registrations', requireAdmin, async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, name, branch, year, email, whatsapp, accommodation, domain, domain2, domain3, created_at
       FROM registrations
       ORDER BY created_at DESC`,
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('list registrations failed:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
