import express, {Request,Response} from "express";
import { RequireAuth,ValidateRequest,NotAuthorizedError,NotFoundError } from "@gittix-microservices/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.put(
    '/api/tickets/update/:id',
    RequireAuth,
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Title will be required"),
        body("price")
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
        const id = req.params.id;
        const {title,price}=req.body;

        const ticket = await Ticket.findById(id);
        if(!ticket){
            throw new NotFoundError();
        }
        if(ticket.userId!==req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        ticket.set({
            title,
            price
        })
        await ticket.save();

        res.status(201).send(ticket);
    }
)

export {router as updateTicketRouter};