import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.MEMBERSHIP_DATA_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "applications.json");

let lock: Promise<unknown> = Promise.resolve();

export function withStoreLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function readStore<T>(): Promise<T[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function writeStore<T>(rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rows, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}
