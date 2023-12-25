import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListner extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const ticket  = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new Error("No ticket found for the provided id");
        }

        ticket.set({orderId:data.id});

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
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