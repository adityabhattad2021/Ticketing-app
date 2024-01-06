import { OrderCreatedEvent, OrderStatus } from "@gittix-microservices/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListner } from "../order-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets";

async function setUp() {
    const listener = new OrderCreatedListner(natsWrapper.jsClient);

    const ticket = Ticket.build({
        title: 'A ticket',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save();

    const orderId = new mongoose.Types.ObjectId().toHexString()

    const data: OrderCreatedEvent['data'] = {
        id: orderId,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, orderId, data, msg };
}


it("Correctly updates the ticket on listening for order created event", async () => {
    const { listener, ticket, orderId, data, msg } = await setUp();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(updatedTicket!.orderId).toEqual(orderId);
});

it("Acknowledeges the message after properly updating the ticket object",async ()=>{
    const {listener,data,msg} = await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

it("Publishes the event with correct order id",async ()=>{
    const { listener, orderId, data, msg } = await setUp();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    expect(ticketUpdatedData.orderId).toEqual(orderId);
})