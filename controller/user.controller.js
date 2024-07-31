import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Post } from '../models/post.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import mongoose from 'mongoose'

const signupUser = async (req,res) => {
    const {email,password,firstName, lastName,username} = req.body
   
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
       });
      if (existingUser) {
         throw new ApiError(400,'User already exists');
      }
   
    const user = new User({username,email,password,firstName, lastName})
     const newUser = await user.save()
     if(!newUser){
        throw new ApiError(400,'Failed to create new user')
     }
     console.log(newUser)
      res.status(201).json(user)
}

//login
const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    console.log(user);

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    console.log(loggedInUser)
    const options = {
        httpOnly: true,
        secure: true
    };

    // Set cookies and redirect to the home page
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    res.send(loggedInUser);
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
    //remove cookie
    //remove refresh token from db
    //send response

    console.log(req?.user?._id);
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

     res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .redirect("/home");
});

//showuser
const showUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    //posts
    const posts = await Post.find({ owner: req.params.id });
   // res.json({ user, posts });
    // res.json(user);
    res.render("./user/profile.ejs",{user,posts})
});
 //updateuserprofilepicandbio
const updateUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const {bio} = req.body
    if(!bio){
        throw new ApiError(400, "bio is required");
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                
                bio: req.body.bio
                }
        },
         { new: true}
    );
    if (!user) {
        throw new ApiError(401, "User not found");
        }
        res.json(user);
});
//updateprofilepic
const updateProfilePic = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const localpath = req?.file?.url
    if(!localpath){
        throw new ApiError(400, "profile picture is required");
    }
    const imgUrl = await uploadOnCloudinary(localpath)
    if(!imgUrl){
    throw new ApiError(400, "Failed to upload image");
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                coverImg: imgUrl.url
                }
        },
        { new: true }
    );
    if (!user) {
        if (!user) {
            throw new ApiError(404, "User coverImg not updated");
        }
    }
    res.json(user)
    });
//profilepicupdaterender
const profilePicUpdateRender = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.render('./user/profilePicUpdate.ejs', { user });
})

    

//renderupdatepage
const renderUpdatePage = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
        }
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
            throw new ApiError(401, "User not found");
    }
    res.render("./user/editProfile.ejs",{user})
 });


//addfollowingandfollower
const followUnfollow = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }
  
    const isFollowing = await User.findOne({ _id: req.user._id, following: { $in: [req.params.id] } });
  
   
    //   const session = await mongoose.startSession();
    //   session.startTransaction();
  
      if (isFollowing) {
        // Unfollow
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
        res.json({ message: "Unfollowed" });
      } else {
        // Follow
        await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
        res.json({ message: "Followed" });
      }
  
     
  });
  



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export {
    loginUser,
    refreshAccessToken,
    signupUser,
    logoutUser,
    showUser,
   followUnfollow,
   renderUpdatePage,
   updateUser,
updateProfilePic,
profilePicUpdateRender,

}