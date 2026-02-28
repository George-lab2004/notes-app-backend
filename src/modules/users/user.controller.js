import bcrypt from "bcrypt"
import { User } from "../../../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../emails/sendEmail.js"


const signUp = async (req, res, next) => {
  try {

    const { name, email, password, age } = req.body
    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await User.create({ name, email, password: hashedPassword, age })

    sendEmail(email).catch((error) => {
      console.error("sendEmail failed:", error?.message || error)
    })

    const safeUser = { _id: user._id, name: user.name, email: user.email, age: user.age }
    res.status(201).json({ message: "Account created successfully", user: safeUser })
  } catch (error) {
    return next(error)
  }
} 


const signIn = async (req,res,next)=>{
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" })
    }

    const user = await User.findOne({ email }).lean()
    if (!user) {
      return res.status(401).json({ message: "invalid email or password" })
    }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return res.status(401).json({ message: "invalid email or password" })
    }

    const secret = process.env.JWT_SECRET
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, secret, {
      expiresIn: "1h",
    })

    delete user.password
    return res.status(200).json({ message: "success welcome token", token, user })
  } catch (error) {
    return next(error)
  }
}
export {signUp, signIn}