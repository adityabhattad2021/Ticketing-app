import { OrderCreatedEvent, OrderStatus } from "@gittix-microservices/common"
import { Message } from "node-nats-streaming"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { expirationQueue } from "../../../queues/expiration-queue";

it("Creates a job on detecting order created event",async ()=>{

    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: 'orderId',
        status: OrderStatus.Created,
        userId: 'userId',
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
            id:'ticketId',
            price: 20,
        }
    }

    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    await listener.onMessage(data,msg);

    // @ts-ignore
    expect(expirationQueue.add).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalled();

})