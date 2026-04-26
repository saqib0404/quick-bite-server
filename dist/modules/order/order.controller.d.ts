import { Request, Response, NextFunction } from "express";
export declare const OrderController: {
    getallOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    checkoutFromCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProviderOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateOrderStatusByProvider: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=order.controller.d.ts.map