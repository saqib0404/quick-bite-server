import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) return next(err);

    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    if (typeof err?.statusCode === "number") {
        statusCode = err.statusCode;
        errorMessage = err.message || errorMessage;
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You have provided invalid field type or missing field.";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Record not found.";
        } else if (err.code === "P2002") {
            statusCode = 409;
            errorMessage = "Duplicate key error.";
        } else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed.";
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occurred during query execution.";
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentication failed. Please check your credentials.";
        } else if (err.errorCode === "P1001") {
            statusCode = 503;
            errorMessage = "Can't reach database server.";
        }
    }

    return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === "production" ? undefined : err,
    });
}

export default errorHandler;
