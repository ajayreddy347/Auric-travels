import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL Database Configuration & Connection Pool
 * 
 * Manages database pooling for Auric Travel backend.
 * Prioritizes hosted Supabase / PostgreSQL via DATABASE_URL environment variable,
 * with seamless fallback to individual DB_* parameters and local development configs.
 */

function cleanEnv(val: string | undefined, fallback: string = ''): string {
  if (!val) return fallback;
  const trimmed = val.trim().replace(/^["']|["']$/g, '').trim();
  const normalized = trimmed.toLowerCase().replace(/\s+/g, '');
  if (normalized === 'localhost' || normalized === '127.0.0.1' || normalized === 'local host') {
    return '127.0.0.1';
  }
  return trimmed;
}

/**
 * Parses safe diagnostic connection details from connection string or individual env vars
 */
export function getSafeConnectionInfo(): {
  host: string;
  port: number;
  database: string;
  user: string;
  hasPassword: boolean;
  isConfigured: boolean;
  ssl: boolean;
  provider: 'supabase' | 'postgres-custom' | 'local' | 'none';
} {
  const connectionString = cleanEnv(process.env.DATABASE_URL || process.env.DB_URL);
  
  if (connectionString) {
    try {
      const parsedUrl = new URL(connectionString);
      const isSupabase = parsedUrl.hostname.includes('supabase.co') || parsedUrl.hostname.includes('supabase.com') || parsedUrl.hostname.includes('supabase');
      return {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port || '5432', 10),
        database: parsedUrl.pathname.replace(/^\//, '') || 'postgres',
        user: parsedUrl.username || 'postgres',
        hasPassword: Boolean(parsedUrl.password),
        isConfigured: true,
        ssl: true,
        provider: isSupabase ? 'supabase' : 'postgres-custom',
      };
    } catch {
      return {
        host: 'remote-database-url',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        hasPassword: true,
        isConfigured: true,
        ssl: true,
        provider: connectionString.includes('supabase') ? 'supabase' : 'postgres-custom',
      };
    }
  }

  const host = cleanEnv(process.env.DB_HOST);
  const port = parseInt(cleanEnv(process.env.DB_PORT, '5432'), 10);
  const database = cleanEnv(process.env.DB_NAME, 'auric_travel');
  const user = cleanEnv(process.env.DB_USER, 'postgres');
  const hasPassword = Boolean(process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim().length > 0);
  const isConfigured = isDbConfigured();

  const isLocal = host === '127.0.0.1' || host === 'localhost' || host === '';
  const isSupabase = host.includes('supabase.co') || host.includes('supabase.com');

  return {
    host: host || (isConfigured ? '127.0.0.1' : 'unconfigured'),
    port: isNaN(port) ? 5432 : port,
    database,
    user,
    hasPassword,
    isConfigured,
    ssl: !isLocal || process.env.DB_SSL === 'true',
    provider: isSupabase ? 'supabase' : (isLocal ? 'local' : 'postgres-custom'),
  };
}

export function isDbConfigured(): boolean {
  const connStr = cleanEnv(process.env.DATABASE_URL || process.env.DB_URL);
  if (connStr && connStr.length > 0) return true;

  const host = cleanEnv(process.env.DB_HOST);
  
  // If host is explicitly set to an external remote database (not localhost or 127.0.0.1)
  if (host.length > 0 && host !== '127.0.0.1' && host !== 'localhost') {
    return true;
  }

  // If host is localhost/127.0.0.1, only consider configured if explicitly enabled via DB_ENABLED=true
  if (process.env.DB_ENABLED === 'true') {
    return true;
  }

  return false;
}

let dbHealthState = {
  lastChecked: 0,
  isOnline: false,
  isChecked: false,
};

export function isDbOnline(): boolean {
  if (!isDbConfigured()) return false;
  return dbHealthState.isOnline;
}

export function setDbOnlineStatus(online: boolean) {
  dbHealthState.isOnline = online;
  dbHealthState.isChecked = true;
  dbHealthState.lastChecked = Date.now();
}

export function getDbConfig() {
  const connectionString = cleanEnv(process.env.DATABASE_URL || process.env.DB_URL);

  if (connectionString) {
    // Detect if this is a remote host (e.g. Supabase, Neon, AWS RDS, Render, Heroku)
    const isRemote =
      !connectionString.includes('127.0.0.1') &&
      !connectionString.includes('localhost') &&
      !connectionString.includes('local%20host');

    const useSsl =
      process.env.DB_SSL !== 'false' &&
      (isRemote ||
        connectionString.includes('sslmode=require') ||
        connectionString.includes('supabase') ||
        connectionString.includes('neon') ||
        connectionString.includes('render') ||
        connectionString.includes('pooler'));

    return {
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 10, // Optimal pool size for serverless/hosted databases
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // 10s timeout for cloud handshakes
    };
  }

  const host = cleanEnv(process.env.DB_HOST, 'localhost');
  const port = parseInt(cleanEnv(process.env.DB_PORT, '5432'), 10);
  const database = cleanEnv(process.env.DB_NAME, 'auric_travel');
  const user = cleanEnv(process.env.DB_USER, 'postgres');
  const password = process.env.DB_PASSWORD !== undefined ? cleanEnv(process.env.DB_PASSWORD) : undefined;
  
  const isRemote = host !== '127.0.0.1' && host !== 'localhost';
  const useSsl =
    process.env.DB_SSL === 'true' ||
    isRemote ||
    host.includes('supabase.co') ||
    host.includes('supabase.com') ||
    host.includes('neon.tech') ||
    host.includes('render.com');

  return {
    host,
    port: isNaN(port) ? 5432 : port,
    database,
    user,
    password,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

let pool: pg.Pool | null = null;

/**
 * Get or initialize the singleton PostgreSQL Connection Pool
 */
export function getPool(): pg.Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = new Pool(config);

    pool.on('error', (err) => {
      // Suppress unhandled pool errors when operating in offline/fallback mode
      if (isDbConfigured()) {
        console.warn('[PostgreSQL Pool Notice]:', err.message);
      }
    });

    pool.on('connect', () => {
      console.log('[PostgreSQL Pool]: Connected to database successfully');
      setDbOnlineStatus(true);
    });
  }
  return pool;
}

/**
 * Reset connection pool (e.g. after environment changes)
 */
export async function resetPool(): Promise<pg.Pool> {
  if (pool) {
    try {
      await pool.end();
    } catch (_) {}
    pool = null;
  }
  return getPool();
}

/**
 * Execute a SQL query using the connection pool
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const activePool = getPool();
  try {
    const res = await activePool.query(text, params);
    const duration = Date.now() - start;
    console.log('[PostgreSQL Query]:', { text: text.slice(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[PostgreSQL Query Error]:', { text, error });
    throw error;
  }
}

/**
 * Verify existence and row counts of the core database tables
 */
export async function verifyDatabaseTables(): Promise<{
  allExist: boolean;
  tables: Record<string, { exists: boolean; rowCount?: number }>;
}> {
  const expectedTables = ['users', 'destinations', 'experiences', 'trips', 'trip_items', 'bookings'];
  const result: Record<string, { exists: boolean; rowCount?: number }> = {};

  if (!isDbConfigured()) {
    for (const t of expectedTables) {
      result[t] = { exists: false };
    }
    return { allExist: false, tables: result };
  }

  try {
    const activePool = getPool();
    // Query table existence in PostgreSQL information_schema
    const res = await activePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = ANY($1);
    `, [expectedTables]);

    const existingTableNames = new Set((res.rows || []).map((r: any) => r.table_name));

    for (const t of expectedTables) {
      const exists = existingTableNames.has(t);
      if (exists) {
        try {
          const countRes = await activePool.query(`SELECT COUNT(*)::int AS count FROM "${t}";`);
          result[t] = { exists: true, rowCount: countRes.rows[0]?.count || 0 };
        } catch {
          result[t] = { exists: true };
        }
      } else {
        result[t] = { exists: false, rowCount: 0 };
      }
    }

    const allExist = expectedTables.every((t) => result[t]?.exists);
    return { allExist, tables: result };
  } catch (err: any) {
    console.warn('[PostgreSQL Table Verification Warning]:', err.message);
    for (const t of expectedTables) {
      result[t] = { exists: false };
    }
    return { allExist: false, tables: result };
  }
}

/**
 * Test PostgreSQL database connection and return detailed diagnostic status
 */
export async function testConnection(): Promise<{
  connected: boolean;
  message: string;
  database?: string;
  serverTime?: string;
  version?: string;
  latencyMs?: number;
  config: {
    host: string;
    port: number;
    database: string;
    user: string;
    hasPassword: boolean;
    isConfigured: boolean;
    ssl: boolean;
    provider: string;
  };
  tables?: Record<string, { exists: boolean; rowCount?: number }>;
  error?: string;
  code?: string;
}> {
  const configured = isDbConfigured();
  const safeConfig = getSafeConnectionInfo();

  if (!configured) {
    setDbOnlineStatus(false);
    return {
      connected: false,
      message: 'PostgreSQL is not configured (DATABASE_URL not set). Running in high-performance repository fallback mode.',
      config: safeConfig,
    };
  }

  const start = Date.now();
  try {
    const activePool = await resetPool();
    const result = await activePool.query('SELECT NOW() as now, current_database() as database, version() as version;');
    const latencyMs = Date.now() - start;
    const row = result.rows[0];
    setDbOnlineStatus(true);

    const tableVerification = await verifyDatabaseTables();

    return {
      connected: true,
      message: `PostgreSQL database (${safeConfig.provider}) connected successfully`,
      database: row?.database || safeConfig.database,
      serverTime: row?.now ? new Date(row.now).toISOString() : new Date().toISOString(),
      version: row?.version,
      latencyMs,
      config: safeConfig,
      tables: tableVerification.tables,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    setDbOnlineStatus(false);
    console.warn('[PostgreSQL Connection Notice]:', err.message);
    return {
      connected: false,
      message: 'PostgreSQL connection unavailable',
      error: err?.message || 'Database connection error',
      code: err?.code || 'CONN_ERROR',
      latencyMs,
      config: safeConfig,
    };
  }
}

/**
 * Gracefully close the database pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[PostgreSQL Pool]: Connection pool closed.');
  }
}

export default {
  getPool,
  query,
  testConnection,
  verifyDatabaseTables,
  closePool,
};
