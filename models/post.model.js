import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Schema } from "mongoose";

const postSchema = new Schema({
    caption: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    likes: {
        type: Number,
        default: 0
    },
    Comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);
