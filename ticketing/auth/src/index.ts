import express from "express";
import "express-async-errors"
import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes";
import { errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();
app.set('trust proxy',true);
app.use(express.json());

app.use(
  cookieSession({
    signed:false,
    secure:true,

  })
)

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*",async () => {
  throw new NotFoundError();
})

// For error handling.
app.use(errorHandler);

const start = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY_MUST_BE_DEFINED');
  }
  try{
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth');
    console.log('[SUCCESSFULLY_CONNECTED_TO_MONGODB]');
  }catch(error){
    console.log('[ERROR_CONNECTING_TO_MONGODB]: ',error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

start();


