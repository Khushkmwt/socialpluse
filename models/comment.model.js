import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Schema } from "mongoose";
import {Post} from '../models/post.model.js'

//commentSchema
const commentSchema = new Schema({
    content: {
        type: String,
        required: true
        },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }  ,
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)