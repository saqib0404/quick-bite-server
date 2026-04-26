import { NextFunction, Request, Response } from "express";
export declare const MenuItemController: {
    createMenuItem: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllMenuItems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMenuItemById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMenuItemByRestaurantId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMenuItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMenuItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=menuItem.controller.d.ts.map