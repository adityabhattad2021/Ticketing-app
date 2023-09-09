import express from "express";
import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

