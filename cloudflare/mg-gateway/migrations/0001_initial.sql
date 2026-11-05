PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS api_tokens (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'support', 'bot')),
  scopes_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS support_volunteers (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  matrix_user_id TEXT NOT NULL UNIQUE,
  room_id TEXT,
  support_hours TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_api_tokens_active ON api_tokens(token_hash, revoked_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_support_public ON support_volunteers(active, verified, display_order);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
