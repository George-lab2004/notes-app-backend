import mongoose from "mongoose"

export const dbConnection = async () => {
    // 1 = connected, 2 = connecting — skip if already connected
    if (mongoose.connection.readyState >= 1) return

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not set")
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
    })
    console.log("db connected")
}