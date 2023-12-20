import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, RequireAuth } from "@gittix-microservices/common";
import express,{Request,Response} from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";


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
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id:order.id,
            status:order.status,
            userId:order.userId,
            expiresAt:order.expiresAt.toISOString(),
            ticket:{
                id:order.ticket.id,
                price:order.ticket.price
            }
        })

        res.status(200).send(order);
    }
)

export {router as deleteOrderRouter};