import { NextFunction, Request, Response } from "express";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!signature || !webhookSecret) {
        console.error("Missing Stripe signature or webhook secret");
        return res.status(400).json({ message: "Missing Stripe signature or webhook secret" });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error: any) {
        console.error("Error processing Stripe webhook:", error);
        return res.status(400).json({ message: "Invalid Stripe webhook signature" });
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);
        return res.status(200).json({
            success: true,
            message: "Stripe webhook event processed successfully",
            data: result,
        });

    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        return res.status(500).json({ message: "Error handling Stripe webhook event" });
    }
};


export const PaymentController = {
    handleStripeWebhookEvent
}