import request from "supertest";
import { app } from "../../app";


it("Can correctly fetch all the active orders from the given user making the request",async ()=>{
    const response = await request(app)
        .get('/api/orders')
        .expect(200);
})