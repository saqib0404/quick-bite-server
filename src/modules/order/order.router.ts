import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth.middleware";
import { OrderController } from "./order.controller";

const router = Router();

router.post("/checkout", auth(UserRole.CUSTOMER), OrderController.checkoutFromCart);

// Customer: view own orders
router.get("/me", auth(UserRole.CUSTOMER), OrderController.getMyOrders);

// Provider: view orders for my restaurants
router.get("/provider", auth(UserRole.PROVIDER), OrderController.getProviderOrders);

// Provider: update order status
router.patch("/:orderId/status", auth(UserRole.PROVIDER), OrderController.updateOrderStatusByProvider);

export const orderRouter = router;
