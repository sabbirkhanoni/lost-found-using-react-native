import axiosInstance from './axiosInstance';

// Auth APIs
export const signUpApi = payload => axiosInstance.post('/auth/signup', payload);

export const verifySignUpOTPApi = payload =>
  axiosInstance.post('/auth/signup/verify-otp', payload);

export const resendOTPApi = email =>
  axiosInstance.post('/auth/signup/resend-otp', { email });

export const loginApi = payload => axiosInstance.post('/auth/login', payload);

export const logoutApi = () => axiosInstance.post('/auth/logout');

export const getMeApi = () => axiosInstance.get('/auth/me');

export const forgetPasswordRequestApi = email =>
  axiosInstance.post('/auth/forget-password', { email });

export const verifyOTPApi = payload =>
  axiosInstance.post('/auth/forget-password/verify-otp', payload);

export const resetPasswordApi = payload =>
  axiosInstance.post('/auth/forget-password/reset', payload);
