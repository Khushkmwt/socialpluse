import 
{   signupUser,loginUser,logoutUser,showUser,
    followUnfollow,updateUser,renderUpdatePage,
    profilePicUpdateRender,updateProfilePic,
} 
from '../controller/user.controller.js'
import express from 'express'
const router = express.Router()
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT,isUserOwnerOfProfile} from '../middleware/auth.middleware.js'
router.get('/signup',(req,res) =>{
    console.log(req.user)
    res.render("./user/signup.ejs");
})

router.post('/signup', signupUser)

router.get('/login',(req,res) =>{
    
    res.render("./user/login.ejs");
})
router.get('/profile/edit/:id',renderUpdatePage)
router.get('/profile/show/:id',showUser)
router.post('/profile/edit/:id',verifyJWT,isUserOwnerOfProfile,updateUser)
router.get("/profile/updatepic/:id",profilePicUpdateRender)
router.post("/profile/updatepic/:id",verifyJWT,isUserOwnerOfProfile,upload.single('profilePic'),updateProfilePic)
router.post('/follow/:id', verifyJWT,followUnfollow)
router.post('/login',loginUser)
router.post('/logout',logoutUser)

export default router