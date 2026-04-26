import { restaurantService } from "./restaurant.service.js";
const createRestaurant = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized!"
            });
        }
        const result = await restaurantService.createRestaurant(req.body, req.user.id);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
const getRestaurants = async (req, res, next) => {
    try {
        const result = await restaurantService.getAllRestaurants();
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const getRestaurantById = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const result = await restaurantService.getRestaurantById(restaurantId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const getRestaurantByProviderId = async (req, res, next) => {
    try {
        const { providerId } = req.params;
        const result = await restaurantService.getRestaurantByProviderId(providerId);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const updateRestaurant = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized!",
            });
        }
        const { restaurantId } = req.params;
        const result = await restaurantService.updateRestaurant(restaurantId, req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Restaurant updated.",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const RestaurantController = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    getRestaurantByProviderId
};
//# sourceMappingURL=restaurant.controller.js.map