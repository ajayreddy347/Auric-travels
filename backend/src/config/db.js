/**
 * Database Connection Module (CommonJS / Node compatibility)
 * 
 * Provides PostgreSQL connection pool configured via environment variables:
 * - DB_HOST
 * - DB_PORT
 * - DB_NAME
 * - DB_USER
 * - DB_PASSWORD
 */
const { Pool } = require('pg');
require('dotenv').config();

function cleanEnv(val, fallback = '') {
  if (!val) return fallback;
  const trimmed = String(val).trim().replace(/^["']|["']$/g, '');
  if (trimmed.toLowerCase().replace(/\s+/g, '') === 'localhost') {
    return 'localhost';
  }
  return trimmed;
}

function getDbConfig() {
  const host = cleanEnv(process.env.DB_HOST, 'localhost');
  const port = parseInt(cleanEnv(process.env.DB_PORT, '5432'), 10);
  const database = cleanEnv(process.env.DB_NAME, 'auric_travel');
  const user = cleanEnv(process.env.DB_USER, 'postgres');
  const password = process.env.DB_PASSWORD !== undefined ? cleanEnv(process.env.DB_PASSWORD) : undefined;
  const connectionString = cleanEnv(process.env.DATABASE_URL || process.env.DB_URL);
  const useSsl =
    process.env.DB_SSL === 'true' ||
    host.includes('supabase.co') ||
    host.includes('neon.tech') ||
    host.includes('render.com') ||
    connectionString.includes('sslmode=require');

  if (connectionString) {
    return {
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  return {
    host,
    port: isNaN(port) ? 5432 : port,
    database,
    user,
    password,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

let pool = null;

function getPool() {
  if (!pool) {
    const config = getDbConfig();
    pool = new Pool(config);
    pool.on('error', (err) => {
      console.error('[PostgreSQL Pool Error]:', err.message);
    });
  }
  return pool;
}

async function testConnection() {
  const activePool = getPool();
  try {
    const res = await activePool.query('SELECT NOW() as now, current_database() as database, version() as version;');
    return {
      connected: true,
      message: 'PostgreSQL database connected successfully',
      database: res.rows[0]?.database || 'auric_travel',
      serverTime: res.rows[0]?.now,
      version: res.rows[0]?.version,
    };
  } catch (err) {
    return {
      connected: false,
      message: 'PostgreSQL connection failed',
      error: err.message,
      code: err.code,
    };
  }
}

module.exports = {
  getPool,
  testConnection,
  pool: getPool(),
};
