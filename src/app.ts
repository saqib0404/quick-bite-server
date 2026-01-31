import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app: Application = express();

app.use(express.json())
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))





export { app }