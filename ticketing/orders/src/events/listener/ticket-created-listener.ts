import { Listener, Subjects, TicketCreatedEvent } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName:string = queueGroupName;

    async onMessage(data:TicketCreatedEvent['data'],msg:Message){
        const {id,title,price}=data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();
        msg.ack();
    }
}