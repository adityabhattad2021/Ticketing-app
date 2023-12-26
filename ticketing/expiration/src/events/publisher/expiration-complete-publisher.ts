import { ExpirationCompletedEvent, Publisher, Subjects } from "@gittix-microservices/common";


export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
    readonly subject = Subjects.ExpirationCompleted;
}