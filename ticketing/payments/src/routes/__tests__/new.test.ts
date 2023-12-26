import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "@gittix-microservices/common";

it("Has a route handler listening to /api/payments/new",async()=>{

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: 'abc',
        version: 0,
        price: 200,
        status: OrderStatus.Created,
    })
    await order.save();

    const response=await request(app)
        .post('/api/payments/new')
        .send({
            orderId:order.id,
            token:"abc"
        });

        expect(response.status).not.toEqual(404);
});


it("Returns 404 if there is no order for the provided id",async ()=>{
    const response=await request(app)
    .post('/api/payments/new')
    .set('Cookie',signIn())
    .send({
        orderId:new mongoose.Types.ObjectId().toHexString(),
        token:"abc"
    });

    expect(response.status).toEqual(404);
})


it("Returns unauthorized if the user is not the owner of the id",async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 200,
        status: OrderStatus.Created,
    })
    await order.save();

    // const cookie = signIn(userId);
    await request(app)
        .post('/api/payments/new')
        .set('Cookie',signIn())
        .send({
            orderId:order.id,
            token:"abc"
        }).expect(401);

})