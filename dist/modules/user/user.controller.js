import { userService } from "./user.service.js";
const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const updateUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const result = await userService.updateUserStatus(userId, status);
        res.status(200).json({
            success: true,
            message: "User status updated.",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const updateMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await userService.updateMe(userId, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
const getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await userService.getMe(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const UserController = {
    getAllUsers, updateUserStatus, updateMe, getMe
};
//# sourceMappingURL=user.controller.js.map