import { Note } from "../../../models/note.model.js";

const addNote = async (req, res, next) => {
    try {
        // Use Note.create() for a single document — insertMany() is for bulk inserts.
        // userId is taken from req.userId (decoded JWT), NOT from req.body,
        // so a client can never forge ownership by sending a userId themselves.
        const note = await Note.create({ ...req.body, userId: req.userId });
        res.status(201).json({ message: "Added successfully", note });
    } catch (error) {
        next(error);
    }
};

const getNotes = async (req, res, next) => {
    try {
        // Fixed populate field name: "userId" (lowercase u) to match the schema field name.
        // Previously "UserId" would silently return no populated data.
        const notes = await Note.find({ userId: req.userId }).populate("userId", "name -_id");
        res.status(200).json({ message: "Fetched successfully", notes });
    } catch (error) {
        next(error);
    }
};

const getOneNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        res.status(200).json({ message: "Fetched successfully", note });
    } catch (error) {
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
 
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "note not found" });
        }
        if (note.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "you are not allowed to update this note" });
        }
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "updated successfully", note: updated });
    } catch (error) {

        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "note not found" });
        }
        if (note.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "you are not allowed to delete this note" });
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { addNote, getNotes, getOneNote, updateNote, deleteNote };