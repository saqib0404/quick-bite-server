import express, { NextFunction, Request, Response } from "express"
import { MenuItemController } from "./menuItem.controller"
const router = express.Router()

router.post("/", MenuItemController.createMenuItem)

export const menuItemsRouter = router