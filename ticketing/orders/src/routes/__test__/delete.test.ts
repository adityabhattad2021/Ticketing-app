import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Has a route hanlder listening to /api/orders/delete/abc for post requests",async ()=>{
    const response = await request(app).delete('/api/orders/delete/abc').send({});
    expect(response.status).not.toEqual(404);
})

it("Can only be accessed if the user is signed in",async ()=>{
    await request(app)
        .delete('/api/orders/delete/abc')
        .send({})
        .expect(401);
})

it("Returns 401 if the user is not authenticated", async () => {
    await request(app)
        .delete("/api/orders/delete/abc")
        .send({})
        .expect(401);
})


it("Returns 404 if the order is not found",async ()=>{
    const fakeId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
                .delete(`/api.orders/delete/${fakeId}`)
                .set('Cookie',signIn())
                .expect(404);
})


it.todo("Deletes the order if the every other check is passed");