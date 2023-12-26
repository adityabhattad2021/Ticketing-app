import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        console.log(data);
        
        const order = Order.build({
            id:data.id,
            userId:data.userId,
            status:data.status,
            price:data.ticket.price,
            version:data.version,
        });
        await order.save();
        msg.ack();
    }
}