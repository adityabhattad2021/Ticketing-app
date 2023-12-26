import express from "express";
import "express-async-errors";
import { errorHandler,NotFoundError,CurrentUser } from "@gittix-microservices/common";
import cookieSession from "cookie-session";
import { createPaymentRouter } from "./routes";



const app = express();
app.set('trust proxy',true);
app.use(express.json());

app.use(
    cookieSession({
        signed:false,
        secure:process.env.NODE_ENV!=='test',
    })
)
app.use(CurrentUser);

// All the routes will go here
app.use(createPaymentRouter);



app.all("*",async ()=>{
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};