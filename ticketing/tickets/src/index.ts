import mongoose from "mongoose";
import {app} from "./app";

const start = async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY_MUST_BE_DEFINED');
    }
    try{
        // await mongoose.connect('<todo>');
        console.log('[SUCCESSFULLY_CONNECTED_TO_MONGOOSE]');
    }catch(error){
        console.log('[ERROR_CONNECTING_TO_MONGODB]',error);
    }   
    app.listen(3000,()=>{
        console.log('Listening on port 3000!');
    })
}

start();