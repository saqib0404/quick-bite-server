import { prisma } from "../../lib/prisma";

type CreateOrUpdateReviewInput = {
    menuItemId: string;
    rating: number;
    comment?: string;
};

const createOrUpdateReview = async (userId: string, data: CreateOrUpdateReviewInput) => {
    const { menuItemId, rating, comment } = data;

    if (!menuItemId) {
        const err: any = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        const err: any = new Error("rating must be an integer between 1 and 5.");
        err.statusCode = 400;
        throw err;
    }

    // Ensure menu item exists
    const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        select: { id: true },
    });

    if (!menuItem) {
        const err: any = new Error("Menu item not found.");
        err.statusCode = 404;
        throw err;
    }

    //  user must have ordered this item at least once
    const hasAnyOrder = await prisma.order.findFirst({
        where: {
            customerId: userId,
            menuItemId,
        },
        select: { id: true },
    });

    if (!hasAnyOrder) {
        const err: any = new Error("You can only review items you have ordered.");
        err.statusCode = 403;
        throw err;
    }

    // Upsert based on unique(userId, menuItemId)
    const review = await prisma.review.upsert({
        where: {
            userId_menuItemId: { userId, menuItemId },
        },
        create: {
            userId,
            menuItemId,
            rating,
            comment: comment ?? null,
        },
        update: {
            rating,
            comment: comment ?? null,
        },
    });

    return review;
};

const getReviewsByMenuItem = async (menuItemId: string) => {
    if (!menuItemId) {
        const err: any = new Error("menuItemId is required.");
        err.statusCode = 400;
        throw err;
    }

    return prisma.review.findMany({
        where: { menuItemId },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

const deleteMyReview = async (userId: string, reviewId: string) => {
    if (!reviewId) {
        const err: any = new Error("reviewId is required.");
        err.statusCode = 400;
        throw err;
    }

    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
        select: { id: true },
    });

    if (!review) {
        const err: any = new Error("Review not found or you don't have access.");
        err.statusCode = 404;
        throw err;
    }

    return prisma.review.delete({
        where: { id: reviewId },
    });
};

export const reviewService = {
    createOrUpdateReview,
    getReviewsByMenuItem,
    deleteMyReview,
};
