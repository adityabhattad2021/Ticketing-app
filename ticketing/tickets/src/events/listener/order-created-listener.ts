import { Listener, OrderCreatedEvent, Subjects } from "@gittix-microservices/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListner extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        
    }
}