import { ExpirationCompletedEvent, OrderStatus } from "@gittix-microservices/common";
import { natsWrapper } from "../../../nats-wrapper";
import createTestOrder from "../../../test/utils/createTestOrder";
import createTestTicket from "../../../test/utils/createTestTicket";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import e from "express";

async function setUp() {
    const listener = new ExpirationCompletedListener(natsWrapper.client);

    const ticket = await createTestTicket();
    const user = signIn();
    const order = await createTestOrder(ticket, user);

    const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order };
}

it("Updates the order status to cancelled", async () => {
    const { listener, data, msg } = await setUp();
    
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(data.orderId);
    
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits order cancelled event",async ()=>{
    const { listener, data, msg } = await setUp();
    
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it("Acknowledeges the borker after successfully processing expiration complete event",async ()=>{
    const {listener,data,msg}=await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

