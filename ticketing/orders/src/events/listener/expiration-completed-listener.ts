import { ExpirationCompletedEvent, Listener, OrderStatus, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { JsMsg } from "nats";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    readonly queueGroupName: string = `${queueGroupName}-expiration-completed`;

    async onMessage(data: ExpirationCompletedEvent['data'], msg: JsMsg) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error("Order with the provided id not found");
        }
        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save();
        await new OrderCancelledPublisher(this.jsClient).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price,
            }
        })
        msg.ack();
    }
}