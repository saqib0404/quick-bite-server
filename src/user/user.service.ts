import { prisma } from "../lib/prisma";



const getAllUsers = async () => {
    return prisma.user.findMany({
        where: {
            role: {
                in: ["CUSTOMER", "PROVIDER"],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            role: true,
            phone: true,
            status: true,
            businessName: true,
            isApproved: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};


export const userService = {
    getAllUsers,
};
