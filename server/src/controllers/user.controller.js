import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

import { uploadOnCloudinary } from "../utils/cloudinary.js"

import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { response } from "express"

import { Scheme } from "../models/scheme.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Error generating tokens", error)
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNo, username, password } = req.body

  if (
    [fullname, phoneNo, username, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { phoneNo }],
  })

  if (existedUser) {
    throw new ApiError(409, "User with phone no. or username already exist")
  }
  const user = await User.create({
    fullname,
    email: email || "",
    phoneNo,
    password,
    username: username,
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "User registration failed")
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser))
})

// PATCH /api/user/profile
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id

//   const { category, gender, income, state, district } = req.body

//   let avatarUrl = undefined

//   // Handle avatar upload if file is provided
//   if (req.file?.path) {
//     const avatarUpload = await uploadOnCloudinary(req.file.path)

//     if (!avatarUpload?.url) {
//       throw new ApiError(400, "Error while uploading avatar")
//     }

//     avatarUrl = avatarUpload.url

//     // TODO: Optional: Delete old avatar from Cloudinary using public_id (if you store it)
//   }

//   // Prepare updated fields
//   const updatedFields = {}
//   if (avatarUrl) updatedFields.avatar = avatarUrl
//   if (category) updatedFields.category = category
//   if (gender) updatedFields.gender = gender
//   if (income) updatedFields.income = income
//   if (state) updatedFields.state = state
//   if (district) updatedFields.district = district

//   // Update user
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     { $set: updatedFields },
//     { new: true }
//   ).select("-password")

//   return res
//     .status(200)
//     .json(new ApiResponse(200, updatedUser, "Profile updated successfully"))
// })

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const {
    fullname,
    phoneNo,
    avatar,
    category,
    gender,
    income,
    state,
    district,
  } = req.body

  let avatarUrl = avatar

  // If uploading a new avatar file using multipart/form-data
  if (req.file?.path) {
    const avatarUpload = await uploadOnCloudinary(req.file.path)

    if (!avatarUpload?.url) {
      throw new ApiError(400, "Error while uploading avatar")
    }

    avatarUrl = avatarUpload.url
  }

  // Build only the fields that are actually provided
  const updatedFields = {}
  if (fullname) updatedFields.fullname = fullname
  if (phoneNo) updatedFields.phoneNo = phoneNo
  if (avatarUrl) updatedFields.avatar = avatarUrl
  if (category) updatedFields.category = category
  if (gender) updatedFields.gender = gender
  if (income) updatedFields.income = income
  if (state) updatedFields.state = state
  if (district) updatedFields.district = district

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedFields },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"))
})
// this above code is for editing the profile
const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNo, username, password } = req.body

  if (!username && !phoneNo) {
    throw new ApiError(400, "username or phone no. is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { phoneNo }],
  })

  if (!user) {
    throw new ApiError(401, "User not found")
  }

  const isPasswordValid = await user.isPasswordValid(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }
  if (!user) {
    throw new ApiError(404, "User not found while generating tokens")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  )

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax", // or "None" if cross-site cookies are needed
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: false,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(400, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  // console.log("req.user:", req.user) // Make sure JWT verified user is attached
  // console.log("req.body:", req.body) // Ensure body is parsed

  const user = await User.findById(req.user?._id)

  // console.log("Raw password from body:", oldPassword)
  // console.log("User from DB:", user)
  // console.log("User.password from DB:", user?.password)

  const isPasswordCorrect = await user.isPasswordValid(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword

  await user.save({ validateBeforeSave: true })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNo } = req.body
  if (!fullname || !email || !phoneNo) {
    throw new ApiError(400, "All field are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email,
        phoneNo,
      },
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})
const updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const { role } = req.body

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role value" })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  user.role = role
  await user.save()

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"))
})
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken")
  res.status(200).json({ users })
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserProfile,
  updateUserRole, // ✅ Add this line
}
