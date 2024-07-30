import express from "express"
const app = express() 
import ejsmate from "ejs-mate"
import cookieParser from 'cookie-parser';
import {authenticateUser} from './middleware/auth.middleware.js'
import path from 'path'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// import session from 'express-session';



// app.use(session({
//     secret: process.env.secret, // Replace with a strong secret
//     resave: false,
//     saveUninitialized: false
// }));

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import commentRouter from './routes/comment.routes.js'
app.use(authenticateUser);
  
app.use((req, res, next) => {
    res.locals.isLoggedIn = res.locals.isLoggedIn || false;
    next();
});



app.use("/",userRouter)
app.use("/post",postRouter)
app.use("/post/comment",commentRouter)




// app.get("/", (req,res) =>{
//     res.render("./user/signup.ejs");
// })
// app.get("/login", (req,res) =>{
//     res.render("./user/login.ejs");
// })



app.use((req, res, next) => {
    res.status(404);
    res.send("page not found")
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export {app}