import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { status } = req.body as { status: string };

    const result = await userService.updateUserStatus(userId as string, status);

    res.status(200).json({
      success: true,
      message: "User status updated.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const result = await userService.updateMe(userId as string, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const result = await userService.getMe(userId as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  getAllUsers, updateUserStatus, updateMe, getMe
};
