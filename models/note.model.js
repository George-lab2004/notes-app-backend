import mongoose, { Schema } from "mongoose";

export const NoteSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,

    },
    content:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   
})
export const Note = mongoose.model("Note", NoteSchema)