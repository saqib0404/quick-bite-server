import { Request, Response, NextFunction } from "express";
export declare const CartController: {
    addToCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    clearCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeCartItemByMenuId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=cart.controller.d.ts.map