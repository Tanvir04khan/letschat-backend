import "dotenv/config";

const PORT = process.env.PORT;
const POSTGRES_LETSCHAT_URL = process.env.POSTGRES_LETSCHAT_URL;
if (!PORT) {
  throw new Error("PORT is required in env variables.");
}

if (!POSTGRES_LETSCHAT_URL) {
  throw new Error("POSTGRES_LETSCHAT_URL is required in env variables.");
}

const ENV_VARS = { PORT, POSTGRES_LETSCHAT_URL };
export default ENV_VARS;
