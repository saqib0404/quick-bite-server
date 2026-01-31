import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/client";

type CheckoutInput = {
    deliveryAddressSnapshot: any; // JSON snapshot required
    notes?: string;
};

const getallOrders = async () => {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

const checkoutFromCart = async (customerId: string, input: CheckoutInput) => {
    if (!input?.deliveryAddressSnapshot) {
        const err: any = new Error("deliveryAddressSnapshot is required for delivery (Cash on Delivery).");
        err.statusCode = 400;
        throw err;
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: customerId },
        select: { id: true, items: true },
    });

    if (!cart) {
        const err: any = new Error("Cart not found.");
        err.statusCode = 404;
        throw err;
    }

    const cartItems = (cart.items as any[]) ?? [];
    if (cartItems.length === 0) {
        const err: any = new Error("Cart is empty.");
        err.statusCode = 400;
        throw err;
    }

    // Validate structure
    for (const item of cartItems) {
        if (!item.menuItemId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
            const err: any = new Error("Cart contains invalid items.");
            err.statusCode = 400;
            throw err;
        }
    }

    // Load all menu items in one query
    const menuItemIds = cartItems.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: menuItemIds } },
        select: {
            id: true,
            priceCents: true,
            isAvailable: true,
            restaurantId: true,
            restaurant: { select: { isActive: true } },
        },
    });

    const map = new Map(menuItems.map((m) => [m.id, m]));

    // Validate all exist and are available
    for (const item of cartItems) {
        const m = map.get(item.menuItemId);
        if (!m) {
            const err: any = new Error(`Menu item not found: ${item.menuItemId}`);
            err.statusCode = 404;
            throw err;
        }
        if (!m.isAvailable || !m.restaurant.isActive) {
            const err: any = new Error("Cart contains unavailable items.");
            err.statusCode = 400;
            throw err;
        }
    }

    // Create orders in a transaction
    const created = await prisma.$transaction(async (tx) => {
        const createdOrders = [];

        for (const item of cartItems) {
            const m = map.get(item.menuItemId)!;
            const quantity = item.quantity as number;

            const totalCents = m.priceCents * quantity;

            const order = await tx.order.create({
                data: {
                    customerId,
                    menuItemId: m.id,
                    restaurantId: m.restaurantId,
                    status: OrderStatus.PENDING, 
                    totalCents,
                    notes: input.notes ?? null,
                    deliveryAddressSnapshot: input.deliveryAddressSnapshot,
                },
            });

            createdOrders.push(order);
        }

        // clear cart after successful order creation
        await tx.cart.update({
            where: { userId: customerId },
            data: { items: [] },
        });

        return createdOrders;
    });

    const grandTotal = created.reduce((sum, o) => sum + o.totalCents, 0);

    return {
        message: "Order placed successfully (Cash on Delivery).",
        totalCents: grandTotal,
        orderCount: created.length,
        orders: created,
    };
};

const getMyOrders = async (customerId: string) => {
    return prisma.order.findMany({
        where: { customerId },
        include: {
            menuItem: true,
            restaurant: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

const getProviderOrders = async (providerId: string) => {
    // provider sees orders for restaurants they own
    return prisma.order.findMany({
        where: {
            restaurant: { providerId },
        },
        include: {
            menuItem: true,
            restaurant: true,
            customer: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const updateOrderStatusByProvider = async (providerId: string, orderId: string, status: OrderStatus) => {
    const allowed: OrderStatus[] = [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
    ];

    if (!allowed.includes(status)) {
        const err: any = new Error("Invalid status value.");
        err.statusCode = 400;
        throw err;
    }

    // ensure provider owns the order's restaurant
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            restaurant: { providerId },
        },
        select: { id: true, status: true },
    });

    if (!order) {
        const err: any = new Error("Order not found or you don't have access.");
        err.statusCode = 404;
        throw err;
    }

    // optional: prevent moving backwards (simple rule)
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
        const err: any = new Error("This order can no longer be updated.");
        err.statusCode = 400;
        throw err;
    }

    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
};

export const orderService = {
    getallOrders,
    checkoutFromCart,
    getMyOrders,
    getProviderOrders,
    updateOrderStatusByProvider,
};
