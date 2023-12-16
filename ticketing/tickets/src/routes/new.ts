import express, {Request,Response} from "express";
import { RequireAuth,ValidateRequest } from "@gittix-microservices/common";
import { body, validationResult } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    '/api/tickets/new',
    RequireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
            
        body('price')
            .custom(async value=>{
                try{
                    const floatVal = parseFloat(value);
                    if(floatVal<0){
                        throw new Error("Negative price not allowed")
                    }
                }catch(_){
                    throw new Error("Invalid Price");
                }
        })
    ],
    ValidateRequest,
    async (req:Request,res:Response)=>{
        const {title,price}=req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId:req.currentUser!.id
        })
        await ticket.save();

        // Emitting the event
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId
        });

        res.status(201).send(ticket);
})

export {router as createTicketRouter};