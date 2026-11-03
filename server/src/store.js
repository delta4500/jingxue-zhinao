import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "../data/db.json");

const initialDb = {
  users: [],
  user_profiles: [],
  project_ideas: [],
  projects: [],
  project_versions: [],
  agent_tasks: [],
  workflow_states: [],
  documents: [],
  document_chapters: [],
  sessions: [],
};

export function readDb() {
  if (!existsSync(dbPath)) {
    mkdirSync(dirname(dbPath), { recursive: true });
    writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), "utf8");
  }
  return JSON.parse(readFileSync(dbPath, "utf8"));
}

export function writeDb(db) {
  mkdirSync(dirname(dbPath), { recursive: true });
  writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export function upsert(db, table, key, item) {
  const list = db[table] ?? [];
  const index = list.findIndex((row) => row[key] === item[key]);
  if (index >= 0) list[index] = item;
  else list.push(item);
  db[table] = list;
  return item;
}
