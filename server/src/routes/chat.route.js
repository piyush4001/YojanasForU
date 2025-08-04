// routes/chat.route.js
import express from "express"
import getGeminiResponse from "../config/gemini.config.js" // Adjust the import path as necessary

const router = express.Router()

router.post("/chat", async (req, res) => {
  const { message, language } = req.body

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Message is required" })
  }

  try {
    const reply = await getGeminiResponse(message, language)
    res.json({ success: true, reply })
  } catch (error) {
    console.error("Gemini error:", error.message)
    res.status(500).json({ success: false, message: "Gemini error", error })
  }
})

export default router // ✅ This line is important
