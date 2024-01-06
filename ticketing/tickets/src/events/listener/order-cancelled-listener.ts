import { Listener, OrderCancelledEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { JsMsg } from "nats";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName: string = `${queueGroupName}-order-cancelled`;

    async onMessage(data: OrderCancelledEvent['data'], msg: JsMsg) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("No ticket found for the provided id");
        }

        ticket.set({ orderId: undefined });

        await ticket.save();

        await new TicketUpdatedPublisher(this.jsClient).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}