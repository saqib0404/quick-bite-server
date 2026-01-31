import { CuisineType, MenuItem } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

type CreateMenuItemInput = {
    restaurantId: string;
    name: string;
    description?: string;
    priceCents: number;
    imageUrl?: string;
    isAvailable?: boolean;
    cuisine: CuisineType,
};

type GetMenuItemsOptions = {
    cuisine?: "MEAT" | "FISH" | "VEG" | "VEGAN" | undefined;
    minPrice?: number | undefined;
};

const createMenuItem = async (userId: string, data: CreateMenuItemInput) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isApproved: true },
    });

    if (!user) {
        const err: any = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    if (user.role !== "PROVIDER") {
        const err: any = new Error("Only providers can create menu items.");
        err.statusCode = 403;
        throw err;
    }

    // if (!user.isApproved) {
    //     const err: any = new Error("Provider is not approved yet.");
    //     err.statusCode = 403;
    //     throw err;
    // }

    const restaurant = await prisma.restaurant.findFirst({
        where: { providerId: userId },
        select: { id: true },
    });


    if (!restaurant) {
        const err: any = new Error("Restaurant not found or you don't own it.");
        err.statusCode = 404;
        throw err;
    }

    const result = await prisma.menuItem.create({
        data: {
            restaurantId: restaurant.id,
            name: data.name,
            description: data.description ?? null,
            priceCents: data.priceCents,
            imageUrl: data.imageUrl ?? null,
            isAvailable: data.isAvailable ?? true,
            cuisine: data.cuisine
        },
    });

    return result;
};

const getAllMenuItems = async ({ cuisine, minPrice }: GetMenuItemsOptions = {}) => {
    const where: any = {
        isAvailable: true,
    };

    if (cuisine) {
        where.cuisine = cuisine;
    }

    if (typeof minPrice === "number") {
        where.priceCents = { gte: minPrice };
    }

    return prisma.menuItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};

const getMenuItemById = async (id: string) => {
    const result = await prisma.menuItem.findUnique({
        where: {
            id
        }
    })
    return result
}

const getMenuItemByRestaurantId = async (id: string) => {
    const result = await prisma.menuItem.findMany({
        where: {
            restaurantId: id
        }
    })
    return result
}

export const menuItemService = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByRestaurantId
}