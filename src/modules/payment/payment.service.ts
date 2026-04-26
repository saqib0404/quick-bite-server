import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { OrderStatus, PaymentStatus, Prisma } from "../../generated/client";

type CartItem = {
    menuItemId: string;
    quantity: number;
};

const toInputJson = (value: unknown): Prisma.InputJsonValue => {
    return JSON.parse(JSON.stringify(value)) as unknown as Prisma.InputJsonValue;
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
    const existingPayment = await prisma.payment.findFirst({
        where: {
            stripeEventId: event.id,
        },
    });

    if (existingPayment) {
        console.log(`Event ${event.id} already processed. Skipping.`);
        return { message: `Event ${event.id} already processed. Skipping.` };
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            const cartId = session.metadata?.cartId;
            const paymentId = session.metadata?.paymentId;
            const customerId = session.metadata?.customerId;

            if (!cartId || !paymentId || !customerId) {
                console.error("Missing metadata in Stripe session.");
                return { message: "Missing metadata." };
            }

            if (session.payment_status !== "paid") {
                console.log(`Checkout completed but payment status is ${session.payment_status}.`);
                return { message: "Payment not paid yet." };
            }

            const payment = await prisma.payment.findUnique({
                where: {
                    id: paymentId,
                },
                include: {
                    cart: true,
                },
            });

            if (!payment) {
                console.error(`Payment ${paymentId} not found.`);
                return { message: "Payment not found." };
            }

            if (payment.status === PaymentStatus.PAID) {
                console.log(`Payment ${paymentId} already marked as paid.`);
                return { message: "Payment already processed." };
            }

            const cart = payment.cart;

            if (!cart || cart.id !== cartId) {
                console.error(`Cart mismatch for payment ${paymentId}.`);
                return { message: "Cart mismatch." };
            }

            const cartItems = Array.isArray(cart.items) ? (cart.items as CartItem[]) : [];

            if (cartItems.length === 0) {
                console.error("Cart is empty. Orders may already have been created.");
                return { message: "Cart is empty." };
            }

            const menuItemIds = cartItems.map((item) => item.menuItemId);

            const menuItems = await prisma.menuItem.findMany({
                where: {
                    id: { in: menuItemIds },
                },
                select: {
                    id: true,
                    priceCents: true,
                    restaurantId: true,
                    isAvailable: true,
                    restaurant: {
                        select: {
                            isActive: true,
                        },
                    },
                },
            });

            const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

            const savedPaymentData = payment.paymentGatewayData as {
                deliveryAddressSnapshot?: any;
                notes?: string | null;
            } | null;

            const createdOrders = await prisma.$transaction(async (tx) => {
                const orders = [];

                await tx.payment.update({
                    where: {
                        id: paymentId,
                    },
                    data: {
                        status: PaymentStatus.PAID,
                        stripeEventId: event.id,
                        paymentGatewayData: toInputJson({
                            deliveryAddressSnapshot: savedPaymentData?.deliveryAddressSnapshot ?? null,
                            notes: savedPaymentData?.notes ?? null,
                            checkoutSession: {
                                id: session.id,
                                paymentStatus: session.payment_status,
                                amountTotal: session.amount_total,
                                currency: session.currency,
                                customerEmail: session.customer_details?.email ?? session.customer_email,
                                paymentIntent: session.payment_intent,
                                metadata: session.metadata,
                            },
                        }),
                    },
                });

                await tx.cart.update({
                    where: {
                        id: cartId,
                    },
                    data: {
                        paymentStatus: PaymentStatus.PAID,
                    },
                });

                for (const item of cartItems) {
                    const menuItem = menuItemMap.get(item.menuItemId);

                    if (!menuItem) {
                        throw new Error(`Menu item not found: ${item.menuItemId}`);
                    }

                    if (!menuItem.isAvailable || !menuItem.restaurant.isActive) {
                        throw new Error("Cart contains unavailable items.");
                    }

                    const order = await tx.order.create({
                        data: {
                            customerId,
                            menuItemId: menuItem.id,
                            restaurantId: menuItem.restaurantId,
                            paymentId,
                            status: OrderStatus.PENDING,
                            quantity: item.quantity,
                            totalCents: menuItem.priceCents * item.quantity,
                            notes: savedPaymentData?.notes ?? null,
                            deliveryAddressSnapshot: savedPaymentData?.deliveryAddressSnapshot ?? null,
                        },
                    });

                    orders.push(order);
                }

                await tx.cart.update({
                    where: {
                        id: cartId,
                    },
                    data: {
                        items: [],
                    },
                });

                return orders;
            });

            return {
                message: "Payment successful and orders created.",
                orderCount: createdOrders.length,
                orders: createdOrders,
            };
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentId = session.metadata?.paymentId;

            if (paymentId) {
                await prisma.payment.update({
                    where: {
                        id: paymentId,
                    },
                    data: {
                        status: PaymentStatus.EXPIRED,
                        stripeEventId: event.id,
                        paymentGatewayData: session as any,
                    },
                });
            }

            return { message: "Checkout session expired." };
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const paymentId = paymentIntent.metadata?.paymentId;

            if (paymentId) {
                await prisma.payment.update({
                    where: {
                        id: paymentId,
                    },
                    data: {
                        status: PaymentStatus.FAILED,
                        stripeEventId: event.id,
                        paymentGatewayData: paymentIntent as any,
                    },
                });
            }

            return { message: "Payment failed." };
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
            return { message: `Unhandled event type ${event.type}` };
    }
};

export const PaymentService = {
    handlerStripeWebhookEvent,
};