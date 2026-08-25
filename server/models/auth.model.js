import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    phone: {
      type: String,
      trim: true,
      match: /^\+?[1-9]\d{1,14}$/,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 26,
      match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,26}$/,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;