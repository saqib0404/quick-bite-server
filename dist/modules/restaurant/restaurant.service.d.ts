import { Restaurant } from "../../generated/client";
type UpdateRestaurantInput = {
    name?: string;
    description?: string | null;
    phone?: string | null;
    addressLine?: string;
    city?: string;
    isActive?: boolean;
};
export declare const restaurantService: {
    createRestaurant: (data: Omit<Restaurant, "id" | "createdAt" | "updatedAt" | "providerId">, userId: string) => Promise<{
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
    }>;
    getAllRestaurants: () => Promise<{
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
    }[]>;
    getRestaurantById: (id: string) => Promise<{
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
    } | null>;
    updateRestaurant: (restaurantId: string, providerId: string, data: UpdateRestaurantInput) => Promise<{
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
    }>;
    getRestaurantByProviderId: (id: string) => Promise<{
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
    } | null>;
};
export {};
//# sourceMappingURL=restaurant.service.d.ts.map