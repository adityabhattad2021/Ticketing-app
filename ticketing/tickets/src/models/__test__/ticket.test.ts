import { Ticket } from "../tickets";

it("Implements optimistic concurrency control",async ()=>{
    const ticket = Ticket.build({
        title:'A new ticket',
        price:200,
        userId:'abc'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price:10});
    secondInstance!.set({price:15});

    await firstInstance!.save();

    try{
        await secondInstance!.save();
    }catch (_){
        return;
    }
    throw new Error("Should not reach to this point");
});


it("Checks if the version of the ticket is incremented on every version",async ()=>{
    const ticket = Ticket.build({
        title:"A new ticket",
        price:200,
        userId:"abc"
    })

    for(let x=0;x<100;x++){
        await ticket.save();
        expect(ticket.version).toEqual(x);
    }
})