import Joi from "joi"
const addNoteValidation = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).max(5000).required(),
})
const updateNoteValidation = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).max(5000).required(),
  id: Joi.string().hex().length(24).required()
})
export { addNoteValidation, updateNoteValidation }