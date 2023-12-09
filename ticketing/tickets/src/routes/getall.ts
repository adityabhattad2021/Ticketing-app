import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get(
    '/api/tickets',
    async (req: Request, res: Response) => {
        const allTickets = await Ticket.find({});

        res.send(allTickets).status(200);
    }
)


export {router as getAllTicketsRouter};