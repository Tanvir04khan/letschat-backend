import { Pool } from "pg";
import ENV_VARS from "./env_vars";

const pool = new Pool({
  connectionString: ENV_VARS.POSTGRES_LETSCHAT_URL,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

export default pool;
