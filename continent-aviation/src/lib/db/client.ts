import "server-only";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";

export type Row = Record<string, unknown>;
export type Db = { query: (sql: string, params?: unknown[]) => Promise<Row[]> };

/**
 * Production: PostgreSQL via DATABASE_URL (Neon, Vercel Postgres, Supabase and others).
 * Development: embedded PGlite (a real Postgres engine) stored in .data/ so the whole workflow runs with no setup.
 * If production has no DATABASE_URL the database is simply unavailable and callers degrade gracefully.
 */
export const dbConfigured = () => Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== "production";

const g = globalThis as unknown as { __caDb?: Promise<Db> };

async function create(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  let db: Db;
  if (url) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 10, onnotice: () => {} });
    db = { query: async (q, p = []) => (await sql.unsafe(q, p as never[])) as unknown as Row[] };
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = process.env.PGLITE_DIR ?? ".data/pglite";
    if (dir !== "memory") fs.mkdirSync(path.dirname(path.resolve(dir)), { recursive: true });
    const pg = dir === "memory" ? new PGlite() : new PGlite(dir);
    db = { query: async (q, p = []) => (await pg.query(q, p)).rows as Row[] };
  }
  for (const stmt of SCHEMA.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) await db.query(stmt);
  return db;
}

export function getDb(): Promise<Db> {
  if (!dbConfigured()) throw new Error("Database is not configured");
  return (g.__caDb ??= create().catch((e) => { g.__caDb = undefined; throw e; }));
}
