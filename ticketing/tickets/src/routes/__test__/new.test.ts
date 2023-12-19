import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

it("Has a route handler listening to /api/tickets/new for post requests", async () => {
    const response = await request(app).post('/api/tickets/new').send({});

    expect(response.status).not.toEqual(404);
});

it("Can only be accessed if the user is signed in", async () => {
    await request(app)
        .post('/api/tickets/new')
        .send({})
        .expect(401);
})

it("Does not return status of 401 if the user is signed in", async () => {

    const cookie = signIn();

    const response = await request(app)
        .post('/api/tickets/new')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);

})


it("Returns an error if an invalid title is provided", async () => {
    await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: '',
            price: '100'
        })
        .expect(400);
})


it("Returns an error if an invalid price is provided", async () => {
    await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: 'This is invalid',
            price: '-200'
        })
        .expect(400);
})


it("Creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: 'This is valid',
            price: '200'
        })
        .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
})


