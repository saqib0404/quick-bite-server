import { Request, Response, NextFunction } from "express";
import { OrderStatus } from "../../../generated/prisma/client";
import { orderService } from "./order.service";

const checkoutFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;

        // deliveryAddressSnapshot is required for COD delivery
        const { deliveryAddressSnapshot, notes } = req.body;

        const result = await orderService.checkoutFromCart(customerId, {
            deliveryAddressSnapshot,
            notes,
        });

        res.status(201).json({
            success: true,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const result = await orderService.getMyOrders(customerId);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getProviderOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providerId = req.user!.id;
        const result = await orderService.getProviderOrders(providerId);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const updateOrderStatusByProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providerId = req.user!.id;
        const { orderId } = req.params;
        const { status } = req.body as { status: OrderStatus };

        const result = await orderService.updateOrderStatusByProvider(providerId, orderId as string, status);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const OrderController = {
    checkoutFromCart,
    getMyOrders,
    getProviderOrders,
    updateOrderStatusByProvider,
};
