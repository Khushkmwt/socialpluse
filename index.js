import { app } from "./app.js";
import dbconnect from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

dbconnect().then( () =>{
    app.listen(process.env.PORT || 8080, (req,res) => {
        console.log('Server is running on port 8080');
    })
}).catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

