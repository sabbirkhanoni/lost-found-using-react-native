import {
    signUpService,
    verifySignUpOTPService,
    resendOTPService,
    loginService,
    getMeService,
    forgetPasswordRequestService,
    verifyOTPService,
    resetPasswordService,
} from '../services/auth.service.js';

export const signUpController = async (request, response) => {
    try {
        const user = await signUpService(request.body);
        if (!user) {
            return response.status(400).json({
                message: 'Registration failed',
                error: true,
                success: false,
            })
        }
        
        return response.status(200).json({
            message: 'Registration successful, please verify your email',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Registration failed',
            error: true,
            success: false,
        })
    }
}

export const verifySignUpOTPController = async (request, response) => {
    try {
        await verifySignUpOTPService(request.body);
        return response.status(200).json({
            message: 'Email verified successfully, you can now login',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'OTP verification failed',
            error: true,
            success: false,
        })
    }
}

export const resendOTPController = async (request, response) => {
    try {
        await resendOTPService(request.body.email);
        return response.status(200).json({
            message: 'OTP resent successfully',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Failed to resend OTP',
            error: true,
            success: false,
        })
    }
}

export const loginController = async (request, response) => {
    try {
        const user = await loginService(request.body);
        request.session.userId = user.user._id;
        return response.status(200).json({
            message: 'Login successfully',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Login failed',
            error: true,
            success: false,
        })
    }
}

export const logoutController = (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            return response.status(500).json({
                message: err.message || 'Logout failed',
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: 'Logout successful',
            error: false,
            success: true,
        });
    });
}

export const getMeController = async (request, response) => {
    try {
        const userId = request.session.userId;
        if (!userId) {
            return response.status(401).json({
                message: 'Unauthorized, Please login to access this resource',
                error: true,
                success: false,
            });
        }
        const user = await getMeService(userId);
        if (!user) {
            return response.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: 'User authenticated',
            error: false,
            success: true,
            user: user
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Failed to authenticate user',
            error: true,
            success: false,
        });
    }
}

export const forgetPasswordRequestController = async (request, response) => {
    try {
        await forgetPasswordRequestService(request.body);
        return response.status(200).json({
            message: 'OTP sent to your email successfully',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Forget password request failed',
            error: true,
            success: false,
        })
    }
}

export const verifyOTPController = async (request, response) => {
    try {
        await verifyOTPService(request.body);
        return response.status(200).json({
            message: 'OTP verified successfully',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'OTP verification failed',
            error: true,
            success: false,
        })
    }
}

export const resetPasswordController = async (request, response) => {
    try {
        await resetPasswordService(request.body);
        return response.status(200).json({
            message: 'Password reset successfully',
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Password reset failed',
            error: true,
            success: false,
        })
    }
}