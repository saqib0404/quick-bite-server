import express, { NextFunction, Request, Response } from "express"
import { MenuItemController } from "./menuItem.controller"
import { auth, UserRole } from "../../middlewares/auth.middleware"
const router = express.Router()

router.get("/", MenuItemController.getAllMenuItems)

router.get("/restaurant/:restaurantId", MenuItemController.getMenuItemByRestaurantId)

router.get("/:menuItemId", MenuItemController.getMenuItemById)

router.post("/", auth(UserRole.PROVIDER), MenuItemController.createMenuItem)

router.patch("/:menuItemId", auth(UserRole.PROVIDER), MenuItemController.updateMenuItem);

router.delete("/:menuItemId", auth(UserRole.PROVIDER), MenuItemController.deleteMenuItem);


export const menuItemsRouter = router