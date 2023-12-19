import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import createTestTicket from "../../test/utils/createTestTicket";
import createTestOrder from "../../test/utils/createTestOrder";

it("Has a route hanlder listening to /api/orders/new for post requests",async ()=>{
    const response = await request(app).post('/api/orders/new').send({});
    expect(response.status).not.toEqual(404);
})

it("Can only be accessed if the user is signed in",async ()=>{
    await request(app)
        .post('/api/orders/new')
        .send({})
        .expect(401);
})

it("Does not return the status of 401 if the user is signed in",async ()=>{
    const cookie = signIn();    

    const response = await request(app)
        .post('/api/orders/new')
        .set('Cookie',cookie)
        .send({});
        expect(response.status).not.toEqual(401);
})

it("Returns error if invalid ticket id is provided",async ()=>{
    await request(app)
        .post('/api/orders/new')
        .set('Cookie',signIn())
        .send({
            ticketId:'abc'
        })
        .expect(400)
})

it("Returns an error if an id of non existant ticket is sent",async ()=>{
    const fakeId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post('/api/orders/new')
        .set('Cookie',signIn())
        .send({
            ticketId:fakeId
        })
        .expect(404);
})


it("Returns an error if the ticket has already been reserved by another order",async ()=>{
    const ticket = await createTestTicket();
    const tempUser = signIn();
    await createTestOrder(ticket,tempUser);

    await request(app)
        .post('/api/orders/new')
        .set('Cookie',signIn())
        .send({
            ticketId:ticket.id
        })
        .expect(400);
    
})


it("Creates the ticket if all the checks are passed",async ()=>{
    const ticket = await createTestTicket();
    const user = signIn();
    
    await request(app)
        .post('/api/orders/new')
        .set('Cookie',user)
        .send({
            ticketId:ticket.id
        })
        .expect(201);

    // check if an order exists in database
    const allOrders = await Order.find({});
    expect(allOrders.length).toEqual(1);
})