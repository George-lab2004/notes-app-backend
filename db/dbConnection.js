import mongoose from "mongoose"

export const dbConnection = () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set in environment variables")
        return
    }
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("db connected")
    }).catch((error) => {
        console.error("db connection failed:", error.message)
    })
}