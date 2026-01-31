import { Restaurant } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createRestaurant = async (data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'providerId'>, userId: string) => {
    const result = await prisma.restaurant.create({
        data: {
            ...data,
            providerId: userId
        }
    })
    return result
}



export const restaurantService = {
    createRestaurant,
}