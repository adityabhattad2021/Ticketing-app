import { Publisher,Subjects,OrderCancelledEvent } from "@gittix-microservices/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}