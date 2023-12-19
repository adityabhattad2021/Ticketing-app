import request from "supertest";
import { app } from "../../app";
import createTestTicket from "../../test/utils/createTestTicket";
import createTestOrder from "../../test/utils/createTestOrder";


it("Has a route hanlder listening to /api/orders/ for get requests",async ()=>{
    const response = await request(app).get('/api/orders').send({});
    expect(response.status).not.toEqual(404);
})

it("Can only be accessed if the user is signed in",async ()=>{
    await request(app)
        .get('/api/orders')
        .send({})
        .expect(401);
})

it("Can correctly fetch all the active orders from the given user making the request",async ()=>{

    // Creating three test tickets
    // 1 by user#1
    // 2 by user#2 
    // and check if it only fetches orders for the user#2
    const user1 = signIn();
    const user2 = signIn();
    const ticket1 = await createTestTicket();
    const ticket2 = await createTestTicket();
    const ticket3 = await createTestTicket();

    await createTestOrder(ticket1,user1);
    await createTestOrder(ticket2,user2);
    await createTestOrder(ticket3,user2);

    const {body:orders} = await request(app)
        .get('/api/orders')
        .set('Cookie',user2)
        .expect(200);
    
    expect(orders.length).toEqual(2);
})