require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Pool } = require("pg");
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is required"); process.exit(1); }
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
    console.log("novera database initialized");
  } catch (error) {
    console.error("database initialization failed:", error.message);
    process.exitCode = 1;
  } finally { await pool.end(); }
})();
