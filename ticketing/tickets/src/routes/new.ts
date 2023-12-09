import express, {Request,Response} from "express";
import { RequireAuth,ValidateRequest } from "@gittix-microservices/common";
import { body, validationResult } from "express-validator";
import { Ticket } from "../models/tickets";

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
            const floatVal = parseFloat(value);
            
            if(floatVal<0){      
                throw new Error('Negative price not expected');
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
        res.status(201).send(ticket);
})

export {router as createTicketRouter};