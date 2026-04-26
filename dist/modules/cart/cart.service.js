import { prisma } from "../../lib/prisma.js";
const addToCart = async (userId, data) => {
    const { menuItemId } = data;
    const quantity = data.quantity ?? 1;
    if (!menuItemId) {
        const err = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        const err = new Error("quantity must be a positive integer.");
        err.statusCode = 400;
        throw err;
    }
    // validate menu item exists
    const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        select: { id: true, isAvailable: true },
    });
    if (!menuItem || !menuItem.isAvailable) {
        const err = new Error("Menu item not available.");
        err.statusCode = 400;
        throw err;
    }
    // find or create cart
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
                items: [{ menuItemId, quantity }],
            },
        });
        return cart;
    }
    const items = cart.items ?? [];
    const existing = items.find((i) => i.menuItemId === menuItemId);
    if (existing) {
        existing.quantity += quantity;
    }
    else {
        items.push({ menuItemId, quantity });
    }
    return prisma.cart.update({
        where: { userId },
        data: { items },
    });
};
const getMyCart = async (userId) => {
    return prisma.cart.findUnique({
        where: { userId },
    });
};
const clearCart = async (userId) => {
    return prisma.cart.update({
        where: { userId },
        data: { items: [] },
    });
};
const removeCartItemByMenuId = async (userId, menuItemId) => {
    if (!menuItemId) {
        const err = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        const err = new Error("Cart not found.");
        err.statusCode = 404;
        throw err;
    }
    const items = (cart.items ?? []).filter((i) => i.menuItemId !== menuItemId);
    // Optional: if nothing removed, tell user
    if ((cart.items ?? []).length === items.length) {
        const err = new Error("Item not found in cart.");
        err.statusCode = 404;
        throw err;
    }
    const updated = await prisma.cart.update({
        where: { userId },
        data: { items },
    });
    return updated;
};
export const cartService = {
    addToCart,
    getMyCart,
    clearCart,
    removeCartItemByMenuId
};
//# sourceMappingURL=cart.service.js.map