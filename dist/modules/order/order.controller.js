import { orderService } from "./order.service.js";
const getallOrders = async (req, res, next) => {
    try {
        const result = await orderService.getallOrders();
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
const checkoutFromCart = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const { deliveryAddressSnapshot, notes } = req.body;
        const result = await orderService.checkoutFromCart(customerId, {
            deliveryAddressSnapshot,
            notes,
        });
        res.status(201).json({
            success: true,
            ...result,
        });
    }
    catch (err) {
        next(err);
    }
};
const getMyOrders = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const result = await orderService.getMyOrders(customerId);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
const getProviderOrders = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await orderService.getProviderOrders(providerId);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
const updateOrderStatusByProvider = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const { orderId } = req.params;
        const { status } = req.body;
        const result = await orderService.updateOrderStatusByProvider(providerId, orderId, status);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
export const OrderController = {
    getallOrders,
    checkoutFromCart,
    getMyOrders,
    getProviderOrders,
    updateOrderStatusByProvider,
};
//# sourceMappingURL=order.controller.js.map