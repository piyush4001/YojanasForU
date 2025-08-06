import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// =======================
// Utils
// =======================
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens", error);
  }
};

// =======================
// Register
// =======================
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNo, username, password } = req.body;

  if ([fullname, phoneNo, username, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { phoneNo }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with phone no. or username already exists");
  }

  const user = await User.create({
    fullname,
    email: email || "",
    phoneNo,
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

// =======================
// Login
// =======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNo, username, password } = req.body;

  if (!username && !phoneNo) {
    throw new ApiError(400, "Username or phone number is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { phoneNo }],
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,             // ✅ Required for cross-origin
    sameSite: "None",         // ✅ Required for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// =======================
// Logout
// =======================
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// =======================
// Refresh Access Token
// =======================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(400, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// =======================
// Profile Update
// =======================
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    fullname,
    phoneNo,
    avatar,
    category,
    gender,
    income,
    state,
    district,
  } = req.body;

  let avatarUrl = avatar;

  if (req.file?.path) {
    const avatarUpload = await uploadOnCloudinary(req.file.path);

    if (!avatarUpload?.url) {
      throw new ApiError(400, "Error while uploading avatar");
    }

    avatarUrl = avatarUpload.url;
  }

  const updatedFields = {};
  if (fullname) updatedFields.fullname = fullname;
  if (phoneNo) updatedFields.phoneNo = phoneNo;
  if (avatarUrl) updatedFields.avatar = avatarUrl;
  if (category) updatedFields.category = category;
  if (gender) updatedFields.gender = gender;
  if (income) updatedFields.income = income;
  if (state) updatedFields.state = state;
  if (district) updatedFields.district = district;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedFields },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// =======================
// Account Details Update
// =======================
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNo } = req.body;

  if (!fullname || !email || !phoneNo) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname, email, phoneNo },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// =======================
// Change Password
// =======================
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordValid(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// =======================
// Get Current User
// =======================
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// =======================
// Update Role (Admin)
// =======================
const updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role value" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

// =======================
// Get All Users
// =======================
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.status(200).json({ users });
});

// =======================
// Export All
// =======================
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserProfile,
  updateUserRole,
  getAllUsers,
};
