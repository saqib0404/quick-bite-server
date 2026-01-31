import { NextFunction, Request, Response } from "express"
import { restaurantService } from "./restaurant.service"

const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.user);
        
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


export const RestaurantController = {
    createRestaurant
}