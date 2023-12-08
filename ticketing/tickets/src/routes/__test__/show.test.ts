import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";


it("Returns 404 if the id does not exists",async ()=>{
    let fakeId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .get(`/api/tickets/${fakeId}`)
            .expect(404);
})


it("Returns a ticket if requested a valid ticket",async ()=>{
    let fakeUserId = new mongoose.Types.ObjectId().toHexString();
    let ticket = Ticket.build({
        title:"Test ticket",
        price:200,
        userId:fakeUserId
    })
    ticket.save();
   
    await request(app)
            .get(`/api/tickets/${ticket.id}`)
            .expect(200)
           
})