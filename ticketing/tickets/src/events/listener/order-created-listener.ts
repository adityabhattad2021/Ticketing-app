import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { JsMsg } from "nats";

export class OrderCreatedListner extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = `${queueGroupName}-order-created`;

    async onMessage(data:OrderCreatedEvent['data'],msg:JsMsg){
        const ticket  = await Ticket.findById(data.ticket.id);
        console.log(ticket);
        

        if(!ticket){
            throw new Error("No ticket found for the provided id");
        }

        ticket.set({orderId:data.id});

        await ticket.save();

        await new TicketUpdatedPublisher(this.jsClient).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version,
            orderId:ticket.orderId
        });

        msg.ack();

    }
}