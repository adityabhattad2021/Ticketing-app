import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@gittix-microservices/common";
import { Message } from "node-nats-streaming";

async function setUp() {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const data: OrderCreatedEvent['data'] = {
        id: orderId,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 100,
        }
    };

    // @ts-ignore
    const msg:Message = {
        ack:jest.fn(),
    }

    return {listener,data,msg,orderId};
};


it("Correctly creates and order object with matching orderId",async ()=>{
    const {listener,data,msg,orderId} = await setUp();

    await listener.onMessage(data,msg);

    const order = await Order.findById(orderId);

    expect(order).not.toBeNull();
});

it("Acknowledges the message after replicating the order in payments microservice",async ()=>{
    const {listener,orderId,data,msg} = await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

