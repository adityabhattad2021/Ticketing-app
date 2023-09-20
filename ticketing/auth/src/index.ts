import express from "express";
import "express-async-errors"
import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes";
import { errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*",async () => {
  throw new NotFoundError();
})

// For error handling
app.use(errorHandler);

const start = async () => {
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


