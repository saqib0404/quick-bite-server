import { Router } from "express";
import { auth, UserRole } from "../middlewares/auth.middleware";
import { UserController } from "./user.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);


export const userRouter = router;