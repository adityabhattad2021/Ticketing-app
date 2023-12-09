import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

const createTestTicket = async () => {
    await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: 'Test ticket',
            price: '100'
        });
}


it("Can correctly fetch all the tickets",async ()=>{
    await createTestTicket();
    await createTestTicket();
    const response = await request(app)
        .get('/api/tickets')
        .expect(200)
    expect(response.body.length).toEqual(2);
})