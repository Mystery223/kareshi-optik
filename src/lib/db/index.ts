import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const dbUrl = process.env.DATABASE_URL;

const getConn = () => {
    if (globalForDb.conn) return globalForDb.conn;

    if (!dbUrl) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('DATABASE_URL is missing during production build/runtime');
        }
        // Return a dummy connection that will fail on first query rather than on module load
        return postgres('postgresql://localhost:5432/missing');
    }

    const newConn = postgres(dbUrl);
    if (process.env.NODE_ENV !== 'production') {
        globalForDb.conn = newConn;
    }
    return newConn;
};

export const db = drizzle(getConn(), { schema });
