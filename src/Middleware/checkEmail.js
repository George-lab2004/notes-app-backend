import { User } from "../../models/user.model.js"

export const checkEmail = async(req,res,next)=>{
try {
     const { email } = req.body
     if (!email) {
          return res.status(400).json({ message: "email is required" })
     }

     const isExist = await User.exists({ email })
     if (isExist) {
          return res.status(409).json({ message: "Email already exists" })
     }

     return next()
} catch (error) {
     return next(error)
}
}