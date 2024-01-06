import { Listener, Subjects, TicketCreatedEvent } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Ticket } from "../../models/ticket";
import { JsMsg } from "nats";

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName:string = `${queueGroupName}-ticket-created`;

    async onMessage(data:TicketCreatedEvent['data'],msg:JsMsg){
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