import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express()
app.use(
  cors({
    origin: ["https://yojanas-for-u.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())
app.use(express.static("public"))

// import routes
import healthcheckRouter from "./routes/healthcheck.route.js"
import userRouter from "./routes/user.route.js"
import schemeRouter from "./routes/scheme.route.js"
import chatRoutes from "./routes/chat.route.js"

//routes

import contactRouter from "./routes/contact.route.js"
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/schemes", schemeRouter)
app.use("/api/v1/chats", chatRoutes)
app.use("/api/v1/contact", contactRouter)
app.get("/", (req, res) => {
  res.send("🚀 YojanasForU backend is running!")
})
app.use(errorHandler)
export { app }
