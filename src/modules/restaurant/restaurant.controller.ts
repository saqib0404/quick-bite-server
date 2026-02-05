import { NextFunction, Request, Response } from "express"
import { restaurantService } from "./restaurant.service"

const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized!"
            })
        }
        const result = await restaurantService.createRestaurant(req.body, req.user.id)
        res.status(201).json(result)
    } catch (error: any) {
        next(error)
    }
}

const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await restaurantService.getAllRestaurants();

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};

const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { restaurantId } = req.params
        const result = await restaurantService.getRestaurantById(restaurantId as string);

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};

const getRestaurantByProviderId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { providerId } = req.params
        const result = await restaurantService.getRestaurantByProviderId(providerId as string);

        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
};

const updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized!",
            });
        }

        const { restaurantId } = req.params;

        const result = await restaurantService.updateRestaurant(
            restaurantId as string,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Restaurant updated.",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


export const RestaurantController = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    getRestaurantByProviderId
}