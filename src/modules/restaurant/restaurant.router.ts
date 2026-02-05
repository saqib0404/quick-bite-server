import express, { NextFunction, Request, Response } from "express"
import { RestaurantController } from "./restaurant.controller"
import { auth, UserRole } from "../../middlewares/auth.middleware"
const router = express.Router()

router.get("/", RestaurantController.getRestaurants)

router.get("/provider/:providerId", auth(UserRole.PROVIDER), RestaurantController.getRestaurantByProviderId)

router.get("/:restaurantId", RestaurantController.getRestaurantById)

router.patch("/:restaurantId", auth(UserRole.PROVIDER), RestaurantController.updateRestaurant);

router.post("/", auth(UserRole.PROVIDER), RestaurantController.createRestaurant)

export const restaurantRouter = router