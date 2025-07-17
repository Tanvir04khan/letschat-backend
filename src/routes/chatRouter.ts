import { Router } from "express";
import getChats from "../controllers/v1/getChats";
import postChat from "../controllers/v1/postChat";

const chatRouter = Router();

chatRouter.get("/v1/getchats", getChats);

chatRouter.post("/v1/postchat", postChat);

export default chatRouter;
