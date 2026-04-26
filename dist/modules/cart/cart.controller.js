import { cartService } from "./cart.service.js";
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await cartService.addToCart(userId, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const getMyCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await cartService.getMyCart(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await cartService.clearCart(userId);
        res.status(200).json({
            success: true,
            message: "Cart cleared.",
        });
    }
    catch (err) {
        next(err);
    }
};
const removeCartItemByMenuId = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { menuItemId } = req.params;
        const result = await cartService.removeCartItemByMenuId(userId, menuItemId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const CartController = {
    addToCart,
    getMyCart,
    clearCart,
    removeCartItemByMenuId
};
//# sourceMappingURL=cart.controller.js.map