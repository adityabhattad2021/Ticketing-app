import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Order } from "../../models/order";
import { JsMsg } from "nats";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = `${queueGroupName}-order-created`;

    async onMessage(data:OrderCreatedEvent['data'],msg:JsMsg){
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