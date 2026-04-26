import { CuisineType } from "../../generated/enums";
type CreateMenuItemInput = {
    restaurantId: string;
    name: string;
    description?: string;
    priceCents: number;
    imageUrl?: string;
    isAvailable?: boolean;
    cuisine: CuisineType;
};
type GetMenuItemsOptions = {
    cuisine?: "MEAT" | "FISH" | "VEG" | "VEGAN" | undefined;
    minPrice?: number | undefined;
};
type UpdateMenuItemInput = {
    name?: string;
    description?: string | null;
    priceCents?: number;
    imageUrl?: string | null;
    isAvailable?: boolean;
    cuisine?: CuisineType;
};
export declare const menuItemService: {
    createMenuItem: (userId: string, data: CreateMenuItemInput) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    getAllMenuItems: ({ cuisine, minPrice }?: GetMenuItemsOptions) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }[]>;
    getMenuItemById: (id: string) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    } | null>;
    getMenuItemByRestaurantId: (id: string) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }[]>;
    updateMenuItem: (providerId: string, menuItemId: string, data: UpdateMenuItemInput) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    deleteMenuItem: (providerId: string, menuItemId: string) => Promise<{
        cuisine: CuisineType;
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
};
export {};
//# sourceMappingURL=menuItem.service.d.ts.map