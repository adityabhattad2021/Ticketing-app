import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListner extends Listener<TicketUpdatedEvent>{

    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName:string = queueGroupName;
 
    async onMessage(data:TicketUpdatedEvent['data'],msg:Message){
        const {id,title,price}=data;
        const ticket = await Ticket.findByEvent(data);
        if(!ticket){
            throw new NotFoundError();
        }
        ticket.set({
            title:title,
            price:price
        })
        await ticket.save();
        msg.ack();
    }

}