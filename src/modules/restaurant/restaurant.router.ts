import express, { NextFunction, Request, Response } from "express"
import { RestaurantController } from "./restaurant.controller"
import { auth, UserRole } from "../../middlewares/auth.middleware"
const router = express.Router()

router.get("/", RestaurantController.getRestaurants)

router.get("/:restaurantId", RestaurantController.getRestaurantById)

router.post("/", auth(UserRole.PROVIDER), RestaurantController.createRestaurant)

export const restaurantRouter = router