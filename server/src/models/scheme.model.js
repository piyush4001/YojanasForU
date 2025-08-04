import mongoose, { Schema } from "mongoose"

const categoryEnum = ["General", "SC", "ST", "OBC", "EWS"]
const genderEnum = ["Male", "Female", "Other"]

const schemeSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    long_description: String,
    eligibility: String,
    image: String,
    benefits: String,
    applicationLink: String,
    Department: String,
    category: [
      {
        type: String,
      },
    ],
    gender: {
      type: String,
      enum: genderEnum,
    },

    location: {
      state: String,
      district: String,
    },
    documents: [String],
    incomeLimit: {
      type: Number,
    },
    govType: {
      type: String,
      enum: ["Central", "State"],
    },
  },
  { timestamps: true }
)

export const Scheme = mongoose.model("Scheme", schemeSchema)
