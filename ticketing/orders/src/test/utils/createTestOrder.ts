import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { TicketDoc } from "../../models/common/ticket-document";
import { OrderStatus } from "@gittix-microservices/common";

export default async function createTestOrder(ticket:TicketDoc,userId:string[]){
    const isTicketAlreadyReserved = await ticket.isReserved();
    if(isTicketAlreadyReserved){
        throw new Error("Ticket is already reserved");
    }
    const order = Order.build({
        userId:userId[0],
        status:OrderStatus.Created,
        expiresAt:new Date,
        ticket:ticket
    })
    await order.save();
    return order;
}