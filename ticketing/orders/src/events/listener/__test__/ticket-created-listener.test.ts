import { TicketCreatedEvent } from "@gittix-microservices/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListner } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { JsMsg } from "nats";

async function setUp() {
    const listener = new TicketCreatedListner(natsWrapper.jsClient);

    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'A title',
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 200,
        version: 0,
        orderId:undefined
    };

    // @ts-ignore
    const msg: JsMsg = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it("Creates and saves the ticket", async () => {
    const { listener, data, msg } = await setUp();

    await listener.onMessage(data,msg);

    const ticket = Ticket.findById(data.id);

    expect(ticket).toBeDefined();
});


it("Calls the ack function on successfully creating a ticket",async ()=>{
    const {listener,data,msg}=await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})