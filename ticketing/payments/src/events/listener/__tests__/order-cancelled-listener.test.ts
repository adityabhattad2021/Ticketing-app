import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@gittix-microservices/common";
import { Message } from "node-nats-streaming";

async function setUp() {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: orderId,
        userId: 'abc',
        version: 0,
        price: 200,
        status: OrderStatus.Created,
    })
    await order.save();

    console.log(order.version,order.id);
    

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        status: order.status,
        userId: 'abc',
        expiresAt: new Date().toISOString(),
        version: order.version+1,
        ticket: {
            id: 'string',
            price: 200,
        },
    }

    // @ts-ignore
    const msg:Message = {
        ack:jest.fn(),
    }

    return {listener,order,data,msg};
}


it("Correctly updates order status to cancelled",async ()=>{
    const {listener,order,data,msg} = await setUp();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})


it("Acknowledeges the message after updating the replicated order object",async ()=>{
    const {listener,order,data,msg} = await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})