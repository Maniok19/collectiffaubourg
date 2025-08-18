import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const DATA_FILE = path.join(__dirname, 'events.json');

const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  name: 'faubourg.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true if behind HTTPS
    maxAge: 1000 * 60 * 60 * 6
  }
}));

function loadEvents() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function saveEvents(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function requireAuth(req, res, next) {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ error: 'Non autorisé' });
}

// Auth routes
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Mot de passe requis' });
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'Mot de passe incorrect' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('faubourg.sid');
    res.json({ ok: true });
  });
});

// Public: list events
app.get('/api/events', (req, res) => {
  const events = loadEvents()
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  res.json(events);
});

// Admin: create
app.post('/api/events', requireAuth, (req, res) => {
  const { titre, description, date, heure, adresse } = req.body || {};
  if (!titre || !date || !heure) {
    return res.status(400).json({ error: 'Champs obligatoires manquants (titre, date, heure)' });
  }
  const events = loadEvents();
  const newEvent = {
    id: nanoid(8),
    titre,
    description: description || '',
    date,   // format YYYY-MM-DD
    heure,  // format HH:MM
    adresse: adresse || ''
  };
  events.push(newEvent);
  saveEvents(events);
  res.status(201).json(newEvent);
});

// Admin: delete
app.delete('/api/events/:id', requireAuth, (req, res) => {
  const events = loadEvents();
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Introuvable' });
  const removed = events.splice(idx, 1)[0];
  saveEvents(events);
  res.json({ ok: true, removed });
});

// Serve frontend (optional: run both from backend)
app.use(express.static(FRONTEND_DIR));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'admin.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Backoffice running on http://localhost:' + port);
});