import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListner } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@gittix-microservices/common";

async function setUp() {
    const listener = new TicketUpdatedListner(natsWrapper.jsClient);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'A Ticket',
        price: 200
    })
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'An updated ticket',
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 300,
        version: 1,
        orderId:undefined
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
}


it("Listens the event and updates the corrosponding ticket accordingly", async () => {
    const { listener, data, msg, ticket } = await setUp();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it("Calls the ack function on successfully updating the ticket",async ()=>{
    const {listener,data,msg}=await setUp();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

