import mongoose from "mongoose"

let isConnected = false

export const dbConnection = async () => {
    if (isConnected) return
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set in environment variables")
        return
    }
    await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
    console.log("db connected")
}