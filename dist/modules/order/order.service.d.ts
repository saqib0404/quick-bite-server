import { OrderStatus, PaymentStatus } from "../../generated/enums";
type CheckoutInput = {
    deliveryAddressSnapshot: any;
    notes?: string;
};
export declare const orderService: {
    getallOrders: () => Promise<{
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
    }[]>;
    checkoutFromCart: (customerId: string, input: CheckoutInput) => Promise<{
        message: string;
        totalCents: any;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: PaymentStatus;
            transactionId: string;
            stripeEventId: string | null;
            stripeSessionId: string | null;
            cartId: string;
            amount: number;
            paymentGatewayData: import("@prisma/client/runtime/client").JsonValue | null;
        };
        paymentUrl: string | null;
    }>;
    getMyOrders: (customerId: string) => Promise<({
        restaurant: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            phone: string | null;
            addressLine: string;
            city: string;
            isActive: boolean;
        };
        menuItem: {
            cuisine: import("../../generated/enums").CuisineType;
            id: string;
            name: string;
            description: string | null;
            priceCents: number;
            imageUrl: string | null;
            isAvailable: boolean;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
    } & {
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
    })[]>;
    getProviderOrders: (providerId: string) => Promise<({
        restaurant: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            phone: string | null;
            addressLine: string;
            city: string;
            isActive: boolean;
        };
        menuItem: {
            cuisine: import("../../generated/enums").CuisineType;
            id: string;
            name: string;
            description: string | null;
            priceCents: number;
            imageUrl: string | null;
            isAvailable: boolean;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            phone: string | null;
            email: string;
        };
    } & {
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
    })[]>;
    updateOrderStatusByProvider: (providerId: string, orderId: string, status: OrderStatus) => Promise<{
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
    }>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map