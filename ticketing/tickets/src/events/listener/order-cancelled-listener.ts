import { Listener,OrderCancelledEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        
    }
}