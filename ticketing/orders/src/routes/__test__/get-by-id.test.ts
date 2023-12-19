import request from "supertest";
import { app } from "../../app";
import createTestTicket from "../../test/utils/createTestTicket";
import createTestOrder from "../../test/utils/createTestOrder";


it("Has a route hanlder listening to /api/orders/:orderId for get requests",async ()=>{
    const response = await request(app).get('/api/orders/abc').send({});
    expect(response.status).not.toEqual(404);
})

it("Can only be accessed if the user is signed in",async ()=>{
    await request(app)
        .get('/api/orders/abc')
        .send({})
        .expect(401);
})

it("Cannot fetch order created by different user",async ()=>{
    const user1 = signIn();
    const user2 = signIn();
    const ticket = await createTestTicket();
    const order = await createTestOrder(ticket,user1);
    await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie',user2)
            .expect(401);
})

it("Can correctly fetch an order by its id",async ()=>{
    const user = signIn();
    const ticket = await createTestTicket();
    const order = await createTestOrder(ticket,user);
    const response = await request(app)
                                .get(`/api/orders/${order.id}`)
                                .set('Cookie',user)
                                .expect(200);

    expect(order.id).toEqual(response.body.id);
})