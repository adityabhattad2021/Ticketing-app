import express from "express";
import "express-async-errors";
import { errorHandler,NotFoundError,CurrentUser } from "@gittix-microservices/common";
import cookieSession from "cookie-session";
import { getAllOrdersRouter } from "./routes/getall";
import { createOrderRouter } from "./routes/new";
import { getOrderByIdRouter } from "./routes/get-by-id";
import { deleteOrderRouter } from "./routes/delete";


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
app.use(createOrderRouter);
app.use(getOrderByIdRouter);
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);



app.all("*",async ()=>{
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};