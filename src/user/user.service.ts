import { prisma } from "../lib/prisma";


const ALLOWED_STATUS = ["ACTIVE", "SUSPENDED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

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

const updateUserStatus = async (userId: string, status: string) => {
    if (!userId) {
        const err: any = new Error("userId is required.");
        err.statusCode = 400;
        throw err;
    }

    if (typeof status !== "string" || !(ALLOWED_STATUS as readonly string[]).includes(status)) {
        const err: any = new Error(`Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`);
        err.statusCode = 400;
        throw err;
    }

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });

    if (!userExists) {
        const err: any = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    if (userExists.role === "ADMIN") {
        const err: any = new Error("Cannot suspend an admin.");
        err.statusCode = 403;
        throw err;
    }

    return prisma.user.update({
        where: { id: userId },
        data: { status: status as AllowedStatus },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
};


export const userService = {
    getAllUsers, updateUserStatus
};
