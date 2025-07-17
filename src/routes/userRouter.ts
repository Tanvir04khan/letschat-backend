import { Router } from "express";
import addUser from "../controllers/v1/addUser";

const userRouter = Router();

userRouter.post("/v1/adduser", addUser);

export default userRouter;
