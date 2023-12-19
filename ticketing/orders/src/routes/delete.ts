import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, RequireAuth, ValidateRequest } from "@gittix-microservices/common";
import express,{Request,Response} from "express";
import { Order } from "../models/order";


const router = express.Router();

router.delete(
    '/api/orders/delete/:orderId',
    RequireAuth,
    async (req:Request,res:Response)=>{
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if(!order){
            throw new NotFoundError();
        }
        if(order.userId!==req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        if(order.status===OrderStatus.Cancelled || order.status===OrderStatus.Completed){
            throw new BadRequestError("The already compleated order cannot be cancelled");
        }
        order.status = OrderStatus.Cancelled;
        order.save();
        res.status(204).send(order);
    }
)

export {router as deleteOrderRouter};