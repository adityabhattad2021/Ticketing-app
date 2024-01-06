import express, { Request, Response } from "express";
import { NotFoundError, RequireAuth, ValidateRequest,BadRequestError, OrderStatus } from "@gittix-microservices/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const ORDER_EXPIRATION_WINDOW = 15*60; // 15 minutes

router.post(
    '/api/orders/new',
    RequireAuth,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .withMessage("tickit id cannot be empty"),
        body("ticketId")
            .custom(async value => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error("Invalid ticket id");
                }
            })
    ],
    ValidateRequest,
    async(req:Request,res:Response)=>{
        // Get the ticket id
        const {ticketId} = req.body;
        const ticket = await Ticket.findById(ticketId);
        // Check if ticket exists, if not throw error
        if(!ticket){
            throw new NotFoundError();
        }
        // Check if the ticket is already been reserved by some other order.
        const isTicketAlreadyReserved = await ticket.isReserved();
        if(isTicketAlreadyReserved){
            throw new BadRequestError("This ticket is already reserved");
        }
        // if it isn't and satisfies all the condition create an order for the ticket.
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds()+ORDER_EXPIRATION_WINDOW);
        const order = Order.build({
            userId:req.currentUser!.id,
            status:OrderStatus.Created,
            expiresAt:expiration,
            ticket:ticket
        })
        await order.save();
    
        // TODO: Emit an event 
        await new OrderCreatedPublisher(natsWrapper.jsClient).publish({
            id:order.id,
            status:order.status,
            userId:order.userId,
            expiresAt:order.expiresAt.toISOString(),
            version:order.version,
            ticket:{
                id:ticket.id,
                price:ticket.price
            }
        }) 

        res.status(201).send(order);
    }
)

export {router as createOrderRouter};