import express from "express";
import { RestaurantController } from "./restaurant.controller.js";
import { auth, UserRole } from "../../middlewares/auth.middleware.js";
const router = express.Router();
router.get("/", RestaurantController.getRestaurants);
router.get("/provider/:providerId", auth(UserRole.PROVIDER), RestaurantController.getRestaurantByProviderId);
router.get("/:restaurantId", RestaurantController.getRestaurantById);
router.patch("/:restaurantId", auth(UserRole.PROVIDER), RestaurantController.updateRestaurant);
router.post("/", auth(UserRole.PROVIDER), RestaurantController.createRestaurant);
export const restaurantRouter = router;
//# sourceMappingURL=restaurant.router.js.map