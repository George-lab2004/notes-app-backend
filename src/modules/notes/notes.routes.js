import {Router} from "express"
import { addNote, deleteNote, getNotes, getOneNote, updateNote } from "./notes.controller.js"
import { verifyToken } from "../../Middleware/verifyToken.js"
import { addNoteValidation, updateNoteValidation } from "./note.validation.js"
import { validation } from "../../Middleware/validate.js"
export const notesRouter = Router()
notesRouter.post("/notes", verifyToken, validation(addNoteValidation), addNote)
notesRouter.get("/notes", verifyToken, getNotes)
notesRouter.get("/notes/:id", getOneNote)
notesRouter.put("/notes/:id", verifyToken, validation(updateNoteValidation), updateNote)
notesRouter.delete("/notes/:id", verifyToken, deleteNote)