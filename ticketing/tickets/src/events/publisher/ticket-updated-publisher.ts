import { Publisher, Subjects, TicketUpdatedEvent } from "@gittix-microservices/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}