import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Define Enums properly
const categoryEnum = ["General", "SC", "ST", "OBC", "EWS"]
const genderEnum = ["Male", "Female", "Other"]

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String, // cloudinary URL
    },

    category: {
      type: String,
      enum: categoryEnum,
    },
    gender: {
      type: String,
      enum: genderEnum,
    },
    income: {
      type: Number,
    },
    state: {
      type: String,
      // required: true,
    },
    district: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

//  Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

//  Method to check password
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//  Access token generator
userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.log("Missing ACCESS_TOKEN_SECRET")
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  )
}

//  Refresh token generator
userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    console.log("Missing REFRESH_TOKEN_SECRET")
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  )
}

export const User = mongoose.model("User", userSchema)
