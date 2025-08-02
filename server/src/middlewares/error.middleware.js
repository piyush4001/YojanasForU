import mongoose from "mongoose"

import { ApiError } from "../utils/ApiError.js"

const errorHandler = (err, req, res, next) => {
  let error = err
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || error instanceof mongoose.Error ? 400 : 500,
      error.message || "Internal Server Error",
      error.errors || [],
      error.stack
    )
  }
  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    errors: error.errors,
  })
}

export { errorHandler }
