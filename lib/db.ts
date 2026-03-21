import { Pool } from "pg";

export const pool = new Pool({
  user: "bennet",
  host: "localhost",
  database: "qrorderapp",
  password: "admin911",
  port: 5432,
});