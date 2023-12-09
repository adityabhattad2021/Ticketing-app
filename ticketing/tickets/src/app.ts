import express from "express";
import "express-async-errors";
import {errorHandler,NotFoundError,CurrentUser} from "@gittix-microservices/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes";
import { showTicketRouter } from "./routes/show";
import { getAllTicketsRouter } from "./routes/getall";

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
// All routes will go here
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);

app.all("*",async ()=>{
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};