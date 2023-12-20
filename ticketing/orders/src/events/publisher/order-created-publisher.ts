import { Publisher,Subjects,OrderCreatedEvent } from "@gittix-microservices/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}