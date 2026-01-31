import { NextFunction, Request, Response } from "express"
import { menuItemService } from "./menuItem.service"

const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await menuItemService.createMenuItem(req.body)
        res.status(201).json(result)
    } catch (error: any) {
        next(error)
    }
}


export const MenuItemController = {
    createMenuItem
}