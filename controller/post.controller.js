import {Post} from '../models/post.model.js'
import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {uploadOnCloudinary } from '../utils/cloudinary.js'
import mongoose from 'mongoose'

const index = asyncHandler(async (req, res) => {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('owner', 'coverImg username');
  
    return res.json(posts);
  });
  

//createpost 
const createPost = asyncHandler(async (req, res) => {
   const {caption} = req.body
   
  // console.log(req.file)
   const LocalImgpath = req.file?.path;
  // console.log(LocalImgpath)
   if(!LocalImgpath){
    throw new ApiError(400,'Image is required')
   }
   const imgPath =await uploadOnCloudinary(LocalImgpath)
   console.log(imgPath.url)
  if(!imgPath.url){
    throw new ApiError(400,'Image upload failed')
  }
  console.log(req.user)
   const post = await Post.create({caption, owner: req.user._id,image:imgPath.url})
   return res.json(post)
})   

//showpost
const showPost = asyncHandler(async (req, res) => {
  const id = req.params.id;
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  const post = await Post.findById(id)
    .populate('owner', 'coverImg username');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.render("./post/showpost.ejs", { post });
});

export {index,
    createPost,
    showPost,
    
}

