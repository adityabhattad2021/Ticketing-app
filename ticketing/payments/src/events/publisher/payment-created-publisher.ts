import { Publisher,PaymentCreatedEvent, Subjects } from "@gittix-microservices/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}