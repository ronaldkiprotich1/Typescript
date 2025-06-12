import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create a pool instead of a single client
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string, // Note: use uppercase DATABASE_URL
});

// Optional: test connection on startup
const main = async () => {
    const client = await pool.connect();
    client.release();
    console.log("Connected to the database via pool");
};
main().catch((error) => {
    console.error("Error connecting to the database:", error);
});

// Export drizzle instance with pool
const db = drizzle(pool, {
    schema,
    logger: true, // Enable or disable logging as needed
});

export default db;

// Helper to check connection
export const checkConnection = async () => {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        return true;
    } finally {
        client.release();
    }
};

// Cleanup function for tests or graceful shutdown
export const closeConnection = async () => {
    await pool.end();
};
