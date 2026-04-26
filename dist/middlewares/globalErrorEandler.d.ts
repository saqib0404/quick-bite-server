import { NextFunction, Request, Response } from "express";
declare function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export default errorHandler;
//# sourceMappingURL=globalErrorEandler.d.ts.map