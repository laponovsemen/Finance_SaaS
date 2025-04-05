import 'dotenv/config'
import * as schema from './schema'

const connectionString = process.env.DB_URL!

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
export const sql = neon(connectionString);
export const db = drizzle({ 
    client: sql, 
    schema 
});