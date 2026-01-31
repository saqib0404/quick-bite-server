import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth.middleware";
import { ReviewController } from "./review.controller";

const router = Router();

// Public reads
router.get("/menu-item/:menuItemId", ReviewController.getReviewsByMenuItem);

// Customer actions
router.post("/", auth(UserRole.CUSTOMER), ReviewController.createOrUpdateReview);
router.delete("/:reviewId", auth(UserRole.CUSTOMER), ReviewController.deleteMyReview);

export const reviewRouter = router;
