import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import db, { pool } from "./db"; // ✅ Import default db and named pool

async function migration() {
  console.log("......Migrations Started......");

  await migrate(db, { migrationsFolder: __dirname + "/migrations" });

  await pool.end(); // ✅ Properly close the connection pool

  console.log("......Migrations Completed......");
  process.exit(0);
}

migration().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
