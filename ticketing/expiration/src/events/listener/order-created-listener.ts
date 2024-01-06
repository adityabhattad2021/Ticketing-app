import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constant/queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";
import { JsMsg } from "nats";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'],msg:JsMsg){
        
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();    
        console.log(`there will be delay of ${delay}.`);

        await expirationQueue.add(
            {
                orderId:data.id
            },
            {
                delay:delay
            }
        );

        msg.ack();
        
    }
}