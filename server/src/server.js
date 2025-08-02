import fs from "fs"
import dotenv from "dotenv"

// Uncomment the following line to log the content of the .env file
// console.log("ENV file content:\n", fs.readFileSync(".env", "utf8"))

import { app } from "./app.js"
import connectDB from "./config/db.index.js"

dotenv.config()
;[
  "PORT",
  "MONGODB_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing env variable: ${key}`)
  }
})

const PORT = process.env.PORT || 7000

await connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}......`)
    })
  })

  .catch((err) => {
    console.log("MongoDB connection MongooseError", err)
  })
