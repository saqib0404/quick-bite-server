import { prisma } from "../../lib/prisma.js";
const ALLOWED_STATUS = ["ACTIVE", "SUSPENDED"];
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
const updateUserStatus = async (userId, status) => {
    if (!userId) {
        const err = new Error("userId is required.");
        err.statusCode = 400;
        throw err;
    }
    if (typeof status !== "string" || !ALLOWED_STATUS.includes(status)) {
        const err = new Error(`Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`);
        err.statusCode = 400;
        throw err;
    }
    const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });
    if (!userExists) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }
    if (userExists.role === "ADMIN") {
        const err = new Error("Cannot suspend an admin.");
        err.statusCode = 403;
        throw err;
    }
    return prisma.user.update({
        where: { id: userId },
        data: { status: status },
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
const updateMe = async (userId, data) => {
    const allowedData = {};
    if (data.name !== undefined)
        allowedData.name = data.name;
    if (data.phone !== undefined)
        allowedData.phone = data.phone;
    if (data.image !== undefined)
        allowedData.image = data.image;
    if (data.addresses !== undefined)
        allowedData.addresses = data.addresses;
    if (data.businessName !== undefined)
        allowedData.businessName = data.businessName;
    if (Object.keys(allowedData).length === 0) {
        const err = new Error("No valid fields provided for update.");
        err.statusCode = 400;
        throw err;
    }
    return prisma.user.update({
        where: { id: userId },
        data: allowedData,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            addresses: true,
            businessName: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
const getMe = async (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            addresses: true,
            businessName: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
export const userService = {
    getAllUsers, updateUserStatus, updateMe, getMe
};
//# sourceMappingURL=user.service.js.map