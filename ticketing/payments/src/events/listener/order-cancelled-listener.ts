import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Order } from "../../models/order";
import { JsMsg } from "nats";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName: string = `${queueGroupName}-order-cancelled`;

    async onMessage(data: OrderCancelledEvent['data'], msg: JsMsg) {
           
        const order = await Order.findOne({
            _id:data.id,
            version:data.version-1,
        });
        
        if (!order) {
            throw new Error('No order found for the provided id');
        }
        order.set({
            status: OrderStatus.Cancelled,
        }),
            await order.save();

        msg.ack();
    }
}