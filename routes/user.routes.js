import {signupUser,loginUser,logoutUser,showUser,followUnfollow} from '../controller/user.controller.js'
import express from 'express'
const router = express.Router()
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'
router.get('/signup',(req,res) =>{
    console.log(req.user)
    res.render("./user/signup.ejs");
})

router.post('/signup', signupUser)

router.get('/login',(req,res) =>{
    
    res.render("./user/login.ejs");
})
router.get('/show/:id',showUser)
router.post('/follow/:id', verifyJWT,followUnfollow)
router.post('/login',loginUser)
router.post('/logout',logoutUser)

export default router