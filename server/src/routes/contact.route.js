import express from "express"
import nodemailer from "nodemailer"

const router = express.Router()

router.post("/", async (req, res) => {
  const { name, email, message } = req.body

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: email,
    to: process.env.TO_EMAIL || process.env.EMAIL_USER,
    subject: `Contact Form - ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending failed:", error)
    res.status(500).json({ message: "Email failed" })
  }
})

export default router
