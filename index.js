import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { dbConnection } from './db/dbConnection.js'
import { userRouter } from './src/modules/users/user.routes.js'
import { notesRouter } from './src/modules/notes/notes.routes.js'
import { User } from './models/user.model.js'
const app = express()
const port = process.env.PORT || 3000
dbConnection()
// express.json() MUST come before any route that reads req.body
app.use(cors())
app.use(express.json())
app.get("/verify/:email", async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { confirmedEmail: true },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.status(200).json({ message: "email verified successfully" })
    } catch (error) {
        return next(error)
    }
})
app.use("/users",userRouter)
app.use(notesRouter)

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Hello World!' }))

// Global error handler — catches any next(error) calls and returns JSON (not HTML)
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// app.listen only runs locally — Vercel handles the server in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default app