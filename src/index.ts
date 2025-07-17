import express, { json, urlencoded } from "express";
import { createServer } from "http";
import ENV_VARS from "./env_vars";
import userRouter from "./routes/userRouter";
import { SocketIoServices } from "./SocketIoServices";
import chatRouter from "./routes/chatRouter";
import { errorHandler } from "./controllers/errorHandler";

const app = express();

app
  .disable("x-powered-by")
  .use(urlencoded({ extended: true }))
  .use(json())
  .get("/status", (_, res) => {
    res.json({ message: "Hello World" });
  });

const httpServer = createServer(app);

new SocketIoServices(httpServer);

app.use(userRouter);

app.use(chatRouter);

app.use(errorHandler);

httpServer.listen(ENV_VARS.PORT || 3000, () => {
  console.log(`Server running Port: http://localhost:${ENV_VARS.PORT}`);
});
