import Joi from "joi";

 let signUpValidation = Joi.object({
  name:Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^[A-z][A-za-z0-9]{4,50}$/),
  refPassword: Joi.valid(Joi.ref("password")).required(),
  age:Joi.number().min(5).max(80).required()
})
 let signInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^[A-z][A-za-z0-9]{4,50}$/),
})
export {
  signUpValidation,
  signInValidation
}