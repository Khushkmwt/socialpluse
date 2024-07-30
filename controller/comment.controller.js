import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {Comment} from '../models/comment.model.js'

//createcomment
export const createComment = asyncHandler(async (req, res) => {
    const {content} = req.body

    const comment = new Comment({content, author: req.user._id,post:req.params.id})
  const newcomment =  await comment.save()
  if(!newcomment){
    return res.status(400).json({message: 'Failed to create comment'})
  }
    res.status(201).json({message: 'Comment created successfully'},newcomment)

 })