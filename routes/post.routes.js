import { Router } from "express";
const router = Router()
import { createPost ,index,showPost} from "../controller/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
router.get("/create",(req,res) =>{
    res.render('./post/create.ejs')
})
router.post("/create",verifyJWT,upload.single('image') , createPost)
router.get("/",index)
router.get('/:id',showPost)

export default router