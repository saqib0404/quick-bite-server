import { prisma } from "../../lib/prisma";

type CartItemInput = {
    menuItemId: string;
    quantity?: number;
};

const addToCart = async (userId: string, data: CartItemInput) => {
    const { menuItemId } = data;
    const quantity = data.quantity ?? 1;

    if (!menuItemId) {
        const err: any = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        const err: any = new Error("quantity must be a positive integer.");
        err.statusCode = 400;
        throw err;
    }

    // validate menu item exists
    const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        select: { id: true, isAvailable: true },
    });

    if (!menuItem || !menuItem.isAvailable) {
        const err: any = new Error("Menu item not available.");
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

    const items = (cart.items as any[]) ?? [];

    const existing = items.find((i) => i.menuItemId === menuItemId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        items.push({ menuItemId, quantity });
    }

    return prisma.cart.update({
        where: { userId },
        data: { items },
    });
};

const getMyCart = async (userId: string) => {
    return prisma.cart.findUnique({
        where: { userId },
    });
};

const clearCart = async (userId: string) => {
    return prisma.cart.update({
        where: { userId },
        data: { items: [] },
    });
};

const removeCartItemByMenuId = async (userId: string, menuItemId: string) => {
    if (!menuItemId) {
        const err: any = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (!cart) {
        const err: any = new Error("Cart not found.");
        err.statusCode = 404;
        throw err;
    }

    const items = ((cart.items as any[]) ?? []).filter((i) => i.menuItemId !== menuItemId);

    // Optional: if nothing removed, tell user
    if (((cart.items as any[]) ?? []).length === items.length) {
        const err: any = new Error("Item not found in cart.");
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
