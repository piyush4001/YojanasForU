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
    eligibility: String,
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
  },
  { timestamps: true }
)

export const Scheme = mongoose.model("Scheme", schemeSchema)
