type UpdateUserInput = {
    name?: string;
    phone?: string | null;
    image?: string | null;
    addresses?: any;
    businessName?: string | null;
};
export declare const userService: {
    getAllUsers: () => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        phone: string | null;
        email: string;
        emailVerified: boolean;
        role: import("../../generated/enums").Role;
        status: string | null;
        businessName: string | null;
        isApproved: boolean;
    }[]>;
    updateUserStatus: (userId: string, status: string) => Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        email: string;
        role: import("../../generated/enums").Role;
        status: string | null;
    }>;
    updateMe: (userId: string, data: UpdateUserInput) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        image: string | null;
        role: import("../../generated/enums").Role;
        status: string | null;
        businessName: string | null;
        addresses: string | null;
    }>;
    getMe: (userId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        image: string | null;
        role: import("../../generated/enums").Role;
        status: string | null;
        businessName: string | null;
        addresses: string | null;
    } | null>;
};
export {};
//# sourceMappingURL=user.service.d.ts.map