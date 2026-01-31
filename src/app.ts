import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { menuItemsRouter } from "./modules/menuItem/menuItem.router";
import { auth } from "./lib/auth";
import { restaurantRouter } from "./modules/restaurant/restaurant.router";

const app: Application = express();

app.use(express.json())
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))


app.all('/api/auth/{*any}', toNodeHandler(auth));

// menu items
app.use("/menu-items", menuItemsRouter)

// retaurants
app.use("/restaurants", restaurantRouter)




export { app }