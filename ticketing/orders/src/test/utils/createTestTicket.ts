import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";


export default async function createTestTicket(){
    const randomId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id:randomId,
        title:'test ticket',
        price:200
    })
    await ticket.save();
    return ticket;
}