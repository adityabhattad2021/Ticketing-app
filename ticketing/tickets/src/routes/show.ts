import express, {Request,Response} from "express";
import { Ticket } from "../models/tickets";
import { NotFoundError } from "@gittix-microservices/common";

const router = express.Router();


router.get(
    '/api/tickets/:id',
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        
        const ticket = await Ticket.findById(id);
        if(!ticket){
            throw new NotFoundError();
        }
        res.send(ticket).status(200);
    }
)


export {router as showTicketRouter};