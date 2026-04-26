import Stripe from "stripe";
import { OrderStatus } from "../../generated/client";
export declare const PaymentService: {
    handlerStripeWebhookEvent: (event: Stripe.Event) => Promise<{
        message: string;
        orderCount?: never;
        orders?: never;
    } | {
        message: string;
        orderCount: number;
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            status: OrderStatus;
            menuItemId: string;
            quantity: number;
            customerId: string;
            paymentId: string | null;
            totalCents: number;
            notes: string | null;
            deliveryAddressSnapshot: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map