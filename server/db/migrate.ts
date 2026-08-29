import fs from 'fs';
import path from 'path';
import { getPool, isDbConfigured } from '../config/db';

/**
 * Executes database migrations (e.g. creating the destinations table and inserting sample records)
 */
export async function runMigrations(): Promise<{ success: boolean; message: string; applied?: string[] }> {
  if (!isDbConfigured()) {
    return { success: true, message: 'Skipped migrations (PostgreSQL not configured)', applied: [] };
  }

  const pool = getPool();
  const migrationsDir = path.join(process.cwd(), 'server', 'db', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    return { success: false, message: 'Migrations directory not found' };
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const applied: string[] = [];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
    try {
      console.log(`[Database Migration] Running ${file}...`);
      await pool.query(sql);
      applied.push(file);
      console.log(`[Database Migration] Successfully applied ${file}`);
    } catch (err: any) {
      console.warn(`[Database Migration Notice] Failed on ${file}:`, err.message);
      return { success: false, message: `Failed on ${file}: ${err.message}`, applied };
    }
  }

  return { success: true, message: `Applied ${applied.length} migration(s)`, applied };
}

