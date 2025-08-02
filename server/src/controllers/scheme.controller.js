import { Scheme } from "../models/scheme.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const createScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create(req.body)
  res.status(201).json(new ApiResponse(201, scheme, "Scheme created"))
})

const getLatestSchemes = asyncHandler(async (req, res) => {
  // Optionally, you can sort or limit the results if needed
  // For example, to get the latest 4 schemes:
  const schemes = await Scheme.find({}).sort({ createdAt: -1 }).limit(4)
  res.status(200).json(new ApiResponse(200, schemes, "Latest schemes fetched"))
})

const getAllSchemes = async (req, res) => {
  try {
    let queryObj = {}
    const body = req.body || {}

    // 🔍 Basic Filters
    if (body.gender) queryObj.gender = body.gender
    if (body.category) {
      if (Array.isArray(body.category)) {
        queryObj.category = { $in: body.category }
      } else if (
        typeof body.category === "string" &&
        body.category.includes(",")
      ) {
        queryObj.category = { $in: body.category.split(",") }
      } else {
        queryObj.category = body.category
      }
    }
    if (body.state) queryObj["location.state"] = body.state
    if (body.district) queryObj["location.district"] = body.district

    // 💰 Range filter for incomeLimit
    if (body.incomeLimit) {
      const limit = {}
      if (body.incomeLimit.gte) limit.$gte = Number(body.incomeLimit.gte)
      if (body.incomeLimit.lte) limit.$lte = Number(body.incomeLimit.lte)
      queryObj.incomeLimit = limit
    }

    // 🔍 Title Search
    if (body.search) {
      queryObj.title = { $regex: body.search, $options: "i" }
    }

    // 🧭 Pagination
    const page = parseInt(body.page) || 1
    let limit = parseInt(body.limit)
    if (!limit || limit < 0) {
      limit = undefined
    }
    const skip = (page - 1) * (limit || 0)
    const total = await Scheme.countDocuments(queryObj)
    const schemes = await Scheme.find(queryObj).skip(skip).limit(limit)

    res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: schemes,
    })
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message })
  }
}

const getSchemeById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id)
  if (!scheme) {
    return res.status(404).json({ success: false, message: "Scheme not found" })
  }
  res.status(200).json(new ApiResponse(200, scheme))
})

const getSchemeByTitle = asyncHandler(async (req, res) => {
  const { title } = req.params

  const cleanedTitle = title.trim().replace(/\s+/g, ".*")

  const scheme = await Scheme.findOne({
    title: { $regex: new RegExp(cleanedTitle, "i") },
  }) // case-insensitive search

  if (!scheme) {
    return res.status(404).json({
      success: false,
      message: `No scheme found with title: ${title}`,
    })
  }

  res.status(200).json(new ApiResponse(200, scheme, "Scheme fetched by title"))
})

const updateScheme = asyncHandler(async (req, res) => {
  const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  res.status(200).json(new ApiResponse(200, updated, "Scheme updated"))
})

const deleteScheme = asyncHandler(async (req, res) => {
  await Scheme.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, "Scheme deleted"))
})

export {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getSchemeByTitle,
  getLatestSchemes,
}
