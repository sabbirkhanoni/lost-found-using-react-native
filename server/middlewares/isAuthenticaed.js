export const isAuthenticated = (request, response, next) => {
    if(!request.session.userId) {
        return response.status(401).json({
            message: 'Unauthorized, Please login to access this resource',
            error: null,
            success: false,
        })
    }
    next();
}