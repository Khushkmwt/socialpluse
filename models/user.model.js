import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    username : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
     },
     password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    coverImg:{
        type:String,
        default:"https://res.cloudinary.com/dpkf9ujxm/image/upload/v1722358733/u9gaaoh4oo2aqykbccac.png"
    },
    bio : {
        type:String  
    },
    following : {
        type : [
            {
                type: Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        default : []
    },
    followers : {
        type : [
            {
                type: Schema.Types.ObjectId,
                ref:"User"
            }
        ],
         default : []
    },
},{timestamps:true})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
// userSchema.methods.isLoggedIn = function(){
//     return this.refreshToken ? true : false
// }
 export const User = mongoose.model("User",userSchema)

