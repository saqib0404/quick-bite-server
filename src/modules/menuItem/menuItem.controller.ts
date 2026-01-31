import { NextFunction, Request, Response } from "express"
import { menuItemService } from "./menuItem.service"

const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Authentication required!"
            })
        }
        const result = await menuItemService.createMenuItem(req.user.id, req.body)
        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        next(error)
    }
}


export const MenuItemController = {
    createMenuItem
}