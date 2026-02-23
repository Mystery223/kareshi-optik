import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Set it in env before running db:baseline.");
  }
  return url;
}

const migrationsFolder = path.resolve(process.cwd(), "src/lib/db/migrations");
const journalPath = path.join(migrationsFolder, "meta/_journal.json");

type JournalEntry = {
  idx: number;
  when: number;
  tag: string;
  breakpoints: boolean;
};

type Journal = {
  version: string;
  dialect: string;
  entries: JournalEntry[];
};

function readJournal(): Journal {
  if (!fs.existsSync(journalPath)) {
    throw new Error(`Missing migration journal: ${journalPath}`);
  }
  const raw = fs.readFileSync(journalPath, "utf8");
  return JSON.parse(raw) as Journal;
}

function resolveMigrationHash(tag: string): string {
  const migrationFile = path.join(migrationsFolder, `${tag}.sql`);
  if (!fs.existsSync(migrationFile)) {
    throw new Error(`Missing migration file: ${migrationFile}`);
  }
  const query = fs.readFileSync(migrationFile, "utf8");
  return crypto.createHash("sha256").update(query).digest("hex");
}

async function run() {
  const journal = readJournal();
  const sql = postgres(getDatabaseUrl(), { max: 1 });

  try {
    await sql.unsafe("CREATE SCHEMA IF NOT EXISTS drizzle");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);

    const existing = await sql.unsafe<{ created_at: string }[]>(
      "select created_at from drizzle.__drizzle_migrations"
    );
    const existingMillis = new Set(existing.map((row) => Number(row.created_at)));

    let inserted = 0;
    for (const entry of journal.entries) {
      if (existingMillis.has(entry.when)) {
        continue;
      }

      const hash = resolveMigrationHash(entry.tag);
      await sql.unsafe(
        "insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)",
        [hash, entry.when]
      );
      inserted += 1;
      console.log(`Inserted baseline migration: ${entry.tag} (${entry.when})`);
    }

    if (inserted === 0) {
      console.log("Baseline already in sync. No rows inserted.");
    } else {
      console.log(`Baseline sync complete. Inserted ${inserted} row(s).`);
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

run().catch((error) => {
  console.error("Failed to baseline migrations:", error);
  process.exit(1);
});
