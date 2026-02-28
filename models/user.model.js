import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[3,"at least 3 chars"]
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    confirmedEmail:{
        type:Boolean,
        default:false
    },
    age:{
        type:Number,
        min:5,
        max:80
    }
},{versionKey:false})
export let User = mongoose.model("User", userSchema)