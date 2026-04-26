type CartItemInput = {
    menuItemId: string;
    quantity?: number;
};
export declare const cartService: {
    addToCart: (userId: string, data: CartItemInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        paymentStatus: import("../../generated/enums").PaymentStatus;
    }>;
    getMyCart: (userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        paymentStatus: import("../../generated/enums").PaymentStatus;
    } | null>;
    clearCart: (userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        paymentStatus: import("../../generated/enums").PaymentStatus;
    }>;
    removeCartItemByMenuId: (userId: string, menuItemId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        paymentStatus: import("../../generated/enums").PaymentStatus;
    }>;
};
export {};
//# sourceMappingURL=cart.service.d.ts.map