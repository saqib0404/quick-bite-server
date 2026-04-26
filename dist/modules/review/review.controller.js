import { reviewService } from "./review.service.js";
const createOrUpdateReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await reviewService.createOrUpdateReview(userId, req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const getReviewsByMenuItem = async (req, res, next) => {
    try {
        const { menuItemId } = req.params;
        const result = await reviewService.getReviewsByMenuItem(menuItemId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const deleteMyReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;
        const result = await reviewService.deleteMyReview(userId, reviewId);
        res.status(200).json({
            success: true,
            message: "Review deleted.",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const ReviewController = {
    createOrUpdateReview,
    getReviewsByMenuItem,
    deleteMyReview,
};
//# sourceMappingURL=review.controller.js.map