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

const getAllMenuItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await menuItemService.getAllMenuItems();

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};

const getMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { menuItemId } = req.params
        const result = await menuItemService.getMenuItemById(menuItemId as string);

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};

const getMenuItemByRestaurantId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { restaurantId } = req.params
        const result = await menuItemService.getMenuItemByRestaurantId(restaurantId as string);

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};


export const MenuItemController = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByRestaurantId
}