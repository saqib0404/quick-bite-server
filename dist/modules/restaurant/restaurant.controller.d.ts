import { NextFunction, Request, Response } from "express";
export declare const RestaurantController: {
    createRestaurant: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getRestaurants: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRestaurantById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRestaurant: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getRestaurantByProviderId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=restaurant.controller.d.ts.map