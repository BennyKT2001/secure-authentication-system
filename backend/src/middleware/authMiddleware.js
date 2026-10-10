import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "❌ No token provided. Access denied.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.sub,
            role: decoded.role,
        };

        next();

    } catch (error) {
        console.error("❌ Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "❌ Invalid or expired token. Access denied.",
        });
    }
};

export const authoriseRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "❌ You do not have permission to perform this action.",
            });
        }

        next();
    };
};