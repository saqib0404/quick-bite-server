import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { menuItemsRouter } from "./modules/menuItem/menuItem.router";
import { auth } from "./lib/auth";
import { restaurantRouter } from "./modules/restaurant/restaurant.router";
import errorHandler from "./middlewares/globalErrorEandler";
import { cartRouter } from "./modules/cart/cart.router";
import { orderRouter } from "./modules/order/order.router";
import { reviewRouter } from "./modules/review/review.router";
import { userRouter } from "./modules/user/user.router";

const app: Application = express();

app.use(express.json())

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL,
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in allowedOrigins or matches Vercel preview pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin) ||
                origin === "http://localhost:3000" ||
                origin === "http://localhost:3001";

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
        // maxAge: 86400, // 24 hours
    }),
);

app.all('/api/auth/{*any}', toNodeHandler(auth));

// menu items
app.use("/menu-items", menuItemsRouter)

// retaurants
app.use("/restaurants", restaurantRouter)

// cart
app.use("/cart", cartRouter);

// order
app.use("/orders", orderRouter);

// review
app.use("/reviews", reviewRouter);

// user
app.use("/users", userRouter);



app.use(errorHandler)

export { app }