import { MenuItem } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createMenuItem = async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => {
    const result = await prisma.menuItem.create({
        data
    })
    return result
}



export const menuItemService = {
    createMenuItem,
}