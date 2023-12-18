import express, {Request,Response, Router} from "express";

const router = express.Router();

router.get(
    '/api/orders',
    async (req:Request,res:Response)=>{
        res.send({}).status(200);
    }
)


export {router as getAllOrdersRouter};