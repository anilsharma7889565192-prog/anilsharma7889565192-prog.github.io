/** Idempotent schema. Works on PostgreSQL and PGlite. */
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  kind TEXT NOT NULL DEFAULT 'charter',
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  from_place TEXT,
  to_place TEXT,
  depart_date TEXT,
  passengers INTEGER,
  aircraft TEXT,
  purpose TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  operator_name TEXT,
  operator_note TEXT,
  admin_note TEXT,
  public_token TEXT
);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status, created_at DESC);

CREATE TABLE IF NOT EXISTS status_history (
  id SERIAL PRIMARY KEY,
  enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS status_history_enquiry_idx ON status_history (enquiry_id, at);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  aircraft_label TEXT NOT NULL,
  operator_name TEXT,
  lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_text TEXT NOT NULL,
  terms TEXT,
  payment_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS quotes_enquiry_idx ON quotes (enquiry_id, created_at DESC);

CREATE TABLE IF NOT EXISTS email_log (
  id SERIAL PRIMARY KEY,
  enquiry_id TEXT,
  type TEXT NOT NULL,
  to_email TEXT NOT NULL,
  ok BOOLEAN NOT NULL,
  error TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_tokens (
  token_hash TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  route TEXT,
  consent BOOLEAN NOT NULL,
  unsubscribe_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS alerts_email_idx ON alerts (email);
`;
