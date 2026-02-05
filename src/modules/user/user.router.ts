import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth.middleware";
import { UserController } from "./user.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

router.get("/me", auth(), UserController.getMe);

router.patch("/me", auth(), UserController.updateMe);

router.patch("/:userId/status", auth(UserRole.ADMIN), UserController.updateUserStatus);



export const userRouter = router;