import { menuItemService } from "./menuItem.service.js";
const CUISINES = ["MEAT", "FISH", "VEG", "VEGAN"];
const createMenuItem = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Authentication required!"
            });
        }
        const result = await menuItemService.createMenuItem(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllMenuItems = async (req, res, next) => {
    try {
        const cuisineRaw = req.query.cuisine;
        const minPriceRaw = req.query.minPrice;
        const cuisine = typeof cuisineRaw === "string" && CUISINES.includes(cuisineRaw)
            ? cuisineRaw
            : undefined;
        const minPrice = typeof minPriceRaw === "string" && !Number.isNaN(Number(minPriceRaw))
            ? Number(minPriceRaw)
            : undefined;
        const result = await menuItemService.getAllMenuItems({
            cuisine,
            minPrice,
        });
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const getMenuItemById = async (req, res, next) => {
    try {
        const { menuItemId } = req.params;
        const result = await menuItemService.getMenuItemById(menuItemId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const getMenuItemByRestaurantId = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const result = await menuItemService.getMenuItemByRestaurantId(restaurantId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const updateMenuItem = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const { menuItemId } = req.params;
        const result = await menuItemService.updateMenuItem(providerId, menuItemId, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const deleteMenuItem = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const { menuItemId } = req.params;
        const result = await menuItemService.deleteMenuItem(providerId, menuItemId);
        res.status(200).json({
            success: true,
            message: "Menu item deleted.",
            data: result,
        });
    }
    catch (err) {
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
};
//# sourceMappingURL=menuItem.controller.js.map