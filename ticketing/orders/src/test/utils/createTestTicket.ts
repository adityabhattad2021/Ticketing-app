import { Ticket } from "../../models/ticket";


export default async function createTestTicket(){
    const ticket = Ticket.build({
        title:'test ticket',
        price:200
    })
    await ticket.save();
    return ticket;
}