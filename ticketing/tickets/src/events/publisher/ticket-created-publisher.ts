import { Publisher, Subjects, TicketCreatedEvent } from "@gittix-microservices/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}