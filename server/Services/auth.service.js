import bcrypt from "bcryptjs";
import UserModel from "../models/auth.model.js";
import sendEmail from "../config/sendEmail.js";
import OTPSendingTemplate from "../utils/OTPSendingTemplate.js";
import {generateOTP} from "../utils/generateOTP.js";

export const signUpService = async (payload) => {
  const { name, email, phone, password } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,26}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be 6-26 characters long and contain at least one letter and one number",
    );
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  const newUser = new UserModel({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    otpExpiry,
  });
  await newUser.save();

  await sendEmail({
    sendTo: email,
    subject: "Verify your Ferot account",
    html: OTPSendingTemplate({ name, otp }),
  });

  return newUser;
};

export const verifySignUpOTPService = async (payload) => {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp) {
    throw new Error("Account already verified");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error("OTP expired, please request a new one");
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return user;
};

export const resendOTPService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail({
    sendTo: email,
    subject: "Your new Ferot verification code",
    html: OTPSendingTemplate({ name: user.name, otp }),
  });
};

export const loginService = async (payload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp) {
    throw new Error("Please verify your email before logging in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const getMeService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await UserModel.findById(userId).select("-password -otp -otpExpiry");
};

export const forgetPasswordRequestService = async (payload) => {
  const { email } = payload;

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail({
    sendTo: email,
    subject: "Reset your Ferot password",
    html: OTPSendingTemplate({ name: user.name, otp }),
  });
};

export const verifyOTPService = async (payload) => {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error("OTP expired");
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { success: true };
};

export const resetPasswordService = async (payload) => {
  const { email, newPassword } = payload;

  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,26}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must be 6-26 characters long and contain at least one letter and one number",
    );
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  return await UserModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};