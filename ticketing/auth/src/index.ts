import mongoose from "mongoose";
import { app } from "./app";


const start = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY_MUST_BE_DEFINED');
  }
  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI_MUST_BE_DEFINED');
  }
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[SUCCESSFULLY_CONNECTED_TO_MONGODB]');
  }catch(error){
    console.log('[ERROR_CONNECTING_TO_MONGODB]: ',error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

start();


