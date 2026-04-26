type CreateOrUpdateReviewInput = {
    menuItemId: string;
    rating: number;
    comment?: string;
};
export declare const reviewService: {
    createOrUpdateReview: (userId: string, data: CreateOrUpdateReviewInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        menuItemId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
    getReviewsByMenuItem: (menuItemId: string) => Promise<({
        user: {
            id: string;
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        menuItemId: string;
        userId: string;
        rating: number;
        comment: string | null;
    })[]>;
    deleteMyReview: (userId: string, reviewId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        menuItemId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
};
export {};
//# sourceMappingURL=review.service.d.ts.map