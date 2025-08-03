import express from "express"
import {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getSchemeByTitle,
  getLatestSchemes,
  getSchemesByCategory,
} from "../controllers/scheme.controller.js"

const router = express.Router()

// Order matters here!
//Public Access - Search & View
router.post("/filter", getAllSchemes)
router.get("/category/:name", getSchemesByCategory) // Fetch schemes by category
router.get("/latest-scheme", getLatestSchemes)
router.get("/title/:title", getSchemeByTitle)
router.get("/:id", getSchemeById)

// Admin Access - Create, Update, Delete
router.post("/", createScheme)
router.patch("/:id", updateScheme)
router.delete("/:id", deleteScheme)

export default router
