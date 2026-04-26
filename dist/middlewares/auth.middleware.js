import { auth as betterAuth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["PROVIDER"] = "PROVIDER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
export const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });
            if (!session || !session.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required.",
                });
            }
            const role = session.user.role;
            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "User role not assigned.",
                });
            }
            const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { status: true },
            });
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role,
                status: dbUser?.status
            };
            if (roles.length && !roles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource.",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=auth.middleware.js.map