import {Router} from "express"
import { signIn, signUp } from "./user.controller.js"
import { checkEmail } from "../../Middleware/checkEmail.js"
import { validation } from "../../Middleware/validate.js"
import { signInValidation, signUpValidation } from "./validation.js"
export const userRouter = Router()
userRouter.post("/signUp", validation(signUpValidation), checkEmail,signUp)
userRouter.post("/signIn",validation(signInValidation), signIn)