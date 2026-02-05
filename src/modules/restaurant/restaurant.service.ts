import { Restaurant } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

type UpdateRestaurantInput = {
    name?: string;
    description?: string | null;
    phone?: string | null;
    addressLine?: string;
    city?: string;
    isActive?: boolean;
};

const createRestaurant = async (data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'providerId'>, userId: string) => {
    const isRestaurantExist = await prisma.restaurant.findFirst({
        where: {
            providerId: userId
        }
    })

    if (isRestaurantExist) {
        throw new Error("You Already have a restaurant ")
    }
    const result = await prisma.restaurant.create({
        data: {
            ...data,
            providerId: userId
        }
    })
    return result
}

const getAllRestaurants = async () => {
    return prisma.restaurant.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getRestaurantById = async (id: string) => {
    const result = await prisma.restaurant.findUnique({
        where: {
            id
        }
    })
    return result
}

const getRestaurantByProviderId = async (id: string) => {
    const result = await prisma.restaurant.findFirst({
        where: {
            providerId: id
        }
    })
    return result
}

const updateRestaurant = async (
    restaurantId: string,
    providerId: string,
    data: UpdateRestaurantInput
) => {
    if (!restaurantId) {
        const err: any = new Error("restaurantId is required.");
        err.statusCode = 400;
        throw err;
    }

    const user = await prisma.user.findUnique({
        where: { id: providerId },
        select: { role: true, status: true },
    });

    if (!user) {
        const err: any = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    if (user.role !== "PROVIDER") {
        const err: any = new Error("Only providers can update restaurant.");
        err.statusCode = 403;
        throw err;
    }

    if ((user.status || "").toUpperCase() === "SUSPENDED") {
        const err: any = new Error("You are SUSPENDED. You cannot update restaurant.");
        err.statusCode = 403;
        throw err;
    }

    const existing = await prisma.restaurant.findFirst({
        where: {
            id: restaurantId,
            providerId,
        },
        select: { id: true },
    });

    if (!existing) {
        const err: any = new Error("Restaurant not found or you don't have access.");
        err.statusCode = 404;
        throw err;
    }

    const allowedData: any = {};

    if (data.name !== undefined) {
        const name = data.name.trim();
        if (!name) {
            const err: any = new Error("name cannot be empty.");
            err.statusCode = 400;
            throw err;
        }
        allowedData.name = name;
    }

    if (data.description !== undefined) {
        allowedData.description =
            data.description === null ? null : data.description.trim() || null;
    }

    if (data.phone !== undefined) {
        allowedData.phone = data.phone === null ? null : data.phone.trim() || null;
    }

    if (data.addressLine !== undefined) {
        const addressLine = data.addressLine.trim();
        if (!addressLine) {
            const err: any = new Error("addressLine cannot be empty.");
            err.statusCode = 400;
            throw err;
        }
        allowedData.addressLine = addressLine;
    }

    if (data.city !== undefined) {
        const city = data.city.trim();
        if (!city) {
            const err: any = new Error("city cannot be empty.");
            err.statusCode = 400;
            throw err;
        }
        allowedData.city = city;
    }

    if (data.isActive !== undefined) {
        if (typeof data.isActive !== "boolean") {
            const err: any = new Error("isActive must be boolean.");
            err.statusCode = 400;
            throw err;
        }
        allowedData.isActive = data.isActive;
    }

    if (Object.keys(allowedData).length === 0) {
        const err: any = new Error("No valid fields provided for update.");
        err.statusCode = 400;
        throw err;
    }

    return prisma.restaurant.update({
        where: { id: restaurantId },
        data: allowedData,
        select: {
            id: true,
            providerId: true,
            name: true,
            description: true,
            phone: true,
            addressLine: true,
            city: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};


export const restaurantService = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    getRestaurantByProviderId
}