import { Request, Response, NextFunction } from "express";
import { reviewService } from "./review.service";

const createOrUpdateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const result = await reviewService.createOrUpdateReview(userId, req.body);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getReviewsByMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { menuItemId } = req.params;

        const result = await reviewService.getReviewsByMenuItem(menuItemId as string);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const deleteMyReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { reviewId } = req.params;

        const result = await reviewService.deleteMyReview(userId, reviewId as string);

        res.status(200).json({
            success: true,
            message: "Review deleted.",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const ReviewController = {
    createOrUpdateReview,
    getReviewsByMenuItem,
    deleteMyReview,
};
