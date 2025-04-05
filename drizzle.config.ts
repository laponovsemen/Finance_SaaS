import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'})

console.log({
    url: process.env.DB_URL!
})
export default defineConfig({
    dialect: 'postgresql',
    schema: './db/schema.ts',
    // driver: 'pg',
    dbCredentials: {
        url: process.env.DB_URL!
    },
    verbose: true,
    strict: true
});