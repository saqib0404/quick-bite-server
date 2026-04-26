import { prisma } from "../../lib/prisma.js";
import { v7 as uuidv7 } from "uuid";
import { stripe } from "../../config/stripe.config.js";
import { OrderStatus, PaymentStatus } from "../../generated/enums.js";
const getallOrders = async () => {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};
const checkoutFromCart = async (customerId, input) => {
    if (!input?.deliveryAddressSnapshot) {
        const err = new Error("deliveryAddressSnapshot is required for delivery (Cash on Delivery).");
        err.statusCode = 400;
        throw err;
    }
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        const err = new Error("FRONTEND_URL is missing in environment variables.");
        err.statusCode = 500;
        throw err;
    }
    const cart = await prisma.cart.findUnique({
        where: { userId: customerId },
        select: {
            id: true,
            userId: true,
            items: true,
            user: {
                select: {
                    email: true,
                    name: true,
                },
            },
        },
    });
    if (!cart) {
        const err = new Error("Cart not found.");
        err.statusCode = 404;
        throw err;
    }
    const cartItems = cart.items ?? [];
    if (cartItems.length === 0) {
        const err = new Error("Cart is empty.");
        err.statusCode = 400;
        throw err;
    }
    // Validate structure
    for (const item of cartItems) {
        if (!item.menuItemId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
            const err = new Error("Cart contains invalid items.");
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
            const err = new Error(`Menu item not found: ${item.menuItemId}`);
            err.statusCode = 404;
            throw err;
        }
        if (!m.isAvailable || !m.restaurant.isActive) {
            const err = new Error("Cart contains unavailable items.");
            err.statusCode = 400;
            throw err;
        }
    }
    const totalCents = cartItems.reduce((sum, item) => {
        const menuItem = map.get(item.menuItemId);
        return sum + menuItem.priceCents * item.quantity;
    }, 0);
    const transactionId = String(uuidv7());
    const payment = await prisma.payment.upsert({
        where: {
            cartId: cart.id,
        },
        update: {
            amount: totalCents,
            transactionId,
            status: PaymentStatus.UNPAID,
            paymentGatewayData: {
                deliveryAddressSnapshot: input.deliveryAddressSnapshot,
                notes: input.notes ?? null,
            },
        },
        create: {
            cartId: cart.id,
            amount: totalCents,
            transactionId,
            status: PaymentStatus.UNPAID,
            paymentGatewayData: {
                deliveryAddressSnapshot: input.deliveryAddressSnapshot,
                notes: input.notes ?? null,
            },
        },
    });
    const currency = "usd";
    const lineItems = cartItems.map((item) => {
        const menuItem = map.get(item.menuItemId);
        return {
            price_data: {
                currency,
                product_data: {
                    name: "Menu Item",
                },
                unit_amount: menuItem.priceCents,
            },
            quantity: item.quantity,
        };
    });
    console.log("Stripe checkout payload", {
        currency,
        totalCents,
        totalDollars: totalCents / 100,
        lineItems,
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        metadata: {
            cartId: cart.id,
            paymentId: payment.id,
            customerId,
        },
        payment_intent_data: {
            metadata: {
                cartId: cart.id,
                paymentId: payment.id,
                customerId,
            },
        },
        client_reference_id: cart.id,
        customer_email: cart.user.email ?? undefined,
        success_url: `${frontendUrl}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/dashboard/cart?canceled=true`,
    });
    await prisma.payment.update({
        where: {
            id: payment.id,
        },
        data: {
            stripeSessionId: session.id,
            paymentGatewayData: {
                deliveryAddressSnapshot: input.deliveryAddressSnapshot,
                notes: input.notes ?? null,
                stripeSessionId: session.id,
            },
        },
    });
    return {
        message: "Stripe payment session created successfully.",
        totalCents,
        payment,
        paymentUrl: session.url,
    };
};
//     // Create orders in a transaction
//     const created = await prisma.$transaction(async (tx) => {
//         const createdOrders = [];
//         for (const item of cartItems) {
//             const m = map.get(item.menuItemId)!;
//             const quantity = item.quantity as number;
//             const totalCents = m.priceCents * quantity;
//             const order = await tx.order.create({
//                 data: {
//                     customerId,
//                     menuItemId: m.id,
//                     restaurantId: m.restaurantId,
//                     status: OrderStatus.PENDING,
//                     totalCents,
//                     notes: input.notes ?? null,
//                     deliveryAddressSnapshot: input.deliveryAddressSnapshot,
//                 },
//             });
//             createdOrders.push(order);
//         }
//         // clear cart after successful order creation
//         await tx.cart.update({
//             where: { userId: customerId },
//             data: { items: [] },
//         });
//         return createdOrders;
//     });
//     const grandTotal = created.reduce((sum, o) => sum + o.totalCents, 0);
//     return {
//         message: "Order placed successfully (Cash on Delivery).",
//         totalCents: grandTotal,
//         orderCount: created.length,
//         orders: created,
//     };
// };
const getMyOrders = async (customerId) => {
    return prisma.order.findMany({
        where: { customerId },
        include: {
            menuItem: true,
            restaurant: true,
        },
        orderBy: { createdAt: "desc" },
    });
};
const getProviderOrders = async (providerId) => {
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
const updateOrderStatusByProvider = async (providerId, orderId, status) => {
    const allowed = [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
    ];
    if (!allowed.includes(status)) {
        const err = new Error("Invalid status value.");
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
        const err = new Error("Order not found or you don't have access.");
        err.statusCode = 404;
        throw err;
    }
    // optional: prevent moving backwards (simple rule)
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
        const err = new Error("This order can no longer be updated.");
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
//# sourceMappingURL=order.service.js.map