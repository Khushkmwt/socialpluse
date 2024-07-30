import {signupUser,loginUser,logoutUser} from '../controller/user.controller.js'
import express from 'express'
const router = express.Router()
import {upload} from '../middleware/multer.middleware.js'
router.get('/signup',(req,res) =>{
    console.log(req.user)
    res.render("./user/signup.ejs");
})

router.post('/signup', signupUser)

router.get('/login',(req,res) =>{
    
    res.render("./user/login.ejs");
})

router.post('/login',loginUser)
router.post('/logout',logoutUser)

export default router