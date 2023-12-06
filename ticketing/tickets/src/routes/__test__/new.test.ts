import request from "supertest";
import { app } from "../../app";

it("Has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
});

it("Can only be accessed if the user is signed in", async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
})

it("Does not return status of 401 if the user is signed in",async ()=>{

    const cookie=signIn();

    const response=await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({});
    
    expect(response.status).not.toEqual(401);

})


it("Returns an error if an invalid title is provided", async () => {
    await request(app)
            .post('/api/tickets')
            .set('Cookie',signIn())
            .send({
                title:'',
                price:'100'
            })
            .expect(400);
})


it("Returns an error if an invalid price is provided", async () => {
    await request(app)
            .post('/api/tickets')
            .set('Cookie',signIn())
            .send({
                title:'This is invalid',
                price:'-200'
            })
            .expect(400);
})


it("Creates a ticket with valid inputs", async () => {

})


