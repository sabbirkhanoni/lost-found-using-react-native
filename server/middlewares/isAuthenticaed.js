import jwt from "jsonwebtoken";

export const isAuthenticated = (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.status(401).json({
                message: "Unauthorized, Please login to access this resource",
                error: true,
                success: false,
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        request.userId = decoded.userId;

        next();

    } catch (error) {
        return response.status(401).json({
            message: "Invalid or expired token",
            error: true,
            success: false,
        });
    }
};