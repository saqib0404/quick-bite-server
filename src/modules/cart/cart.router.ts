import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth.middleware";
import { CartController } from "./cart.controller";
const router = Router();

router.post("/add", auth(UserRole.CUSTOMER), CartController.addToCart);

router.get("/", auth(UserRole.CUSTOMER), CartController.getMyCart);

router.delete("/item/:menuItemId", auth(UserRole.CUSTOMER), CartController.removeCartItemByMenuId);

router.delete("/clear", auth(UserRole.CUSTOMER), CartController.clearCart);

export const cartRouter = router
