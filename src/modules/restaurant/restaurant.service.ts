import { Restaurant } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

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


export const restaurantService = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById
}