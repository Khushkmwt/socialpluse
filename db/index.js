const DB_NAME="socialplus"

import mongoose from "mongoose"
const dbconnect = async() =>{
    try {
     const connectionInstance = await  mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
     console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
   
}

export default dbconnect