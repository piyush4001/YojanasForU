import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// console.log("Cloudinary ENV:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET,
// })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //console.log("Uploading to Cloudinary:", localFilePath)

    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })

    //console.log("Upload Success:", response.url)

    // fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    try {
      // fs.unlinkSync(localFilePath)
    } catch (err) {
      console.error("Failed to delete local file:", err.message)
    }
    return null
  }
}

export { uploadOnCloudinary }
