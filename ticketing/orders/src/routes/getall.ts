import { RequireAuth } from "@gittix-microservices/common";
import express, {Request,Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
    '/api/orders',
    RequireAuth,
    async (req:Request,res:Response)=>{        
        const allOrders = await Order.find({
            userId:req.currentUser!.id
        }).populate('ticket');
        
        res.send(allOrders).status(200);
    }
)


export {router as getAllOrdersRouter};