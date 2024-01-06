import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Ticket } from "../../models/ticket";
import { JsMsg } from "nats";

export class TicketUpdatedListner extends Listener<TicketUpdatedEvent>{

    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName:string = `${queueGroupName}-ticket-updated`;
 
    async onMessage(data:TicketUpdatedEvent['data'],msg:JsMsg){
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