import { NextFunction, Request, Response } from "express"
import { menuItemService } from "./menuItem.service"

const CUISINES = ["MEAT", "FISH", "VEG", "VEGAN"] as const;
type Cuisine = (typeof CUISINES)[number];

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
        const cuisineRaw = req.query.cuisine;
        const minPriceRaw = req.query.minPrice;

        const cuisine =
            typeof cuisineRaw === "string" && (CUISINES as readonly string[]).includes(cuisineRaw)
                ? (cuisineRaw as Cuisine)
                : undefined;

        const minPrice =
            typeof minPriceRaw === "string" && !Number.isNaN(Number(minPriceRaw))
                ? Number(minPriceRaw)
                : undefined;

        const result = await menuItemService.getAllMenuItems({
            cuisine,
            minPrice,
        });
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

const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providerId = req.user!.id;
        const { menuItemId } = req.params;

        const result = await menuItemService.updateMenuItem(providerId, menuItemId as string, req.body);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providerId = req.user!.id;
        const { menuItemId } = req.params;

        const result = await menuItemService.deleteMenuItem(providerId, menuItemId as string);

        res.status(200).json({
            success: true,
            message: "Menu item deleted.",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


export const MenuItemController = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByRestaurantId,
    updateMenuItem,
    deleteMenuItem
}