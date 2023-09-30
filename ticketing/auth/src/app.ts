import express from "express";
import "express-async-errors"
import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes";
import { errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";
import cookieSession from "cookie-session";

const app = express();
app.set('trust proxy',true);
app.use(express.json());

app.use(
  cookieSession({
    signed:false,
    secure:process.env.NODE_ENV!=='test',

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

export { app };