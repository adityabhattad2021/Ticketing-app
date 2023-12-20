import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";
import createTestTicket from "../../test/utils/createTestTicket";
import { natsWrapper } from "../../nats-wrapper";

it("Returns 404 if provided id does not exists", async () => {
    let fakeId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/update/${fakeId}`)
        .expect(404);
});

it("Returns 401 if the user is not authenticated", async () => {
    const testTicket = await createTestTicket();

    await request(app)
        .put(`/api/tickets/update/${testTicket.id}`)
        .send({
            title: 'Updated title',
            price: 200
        }).expect(401);

})

it("Returns 401 if the user does not owns the ticket", async () => {
    // Creating a ticket with one userId
    const response = await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: 'This is valid',
            price: '200'
        });

    const ticketId = response.body.id;

    // Trying to update it using another user.
    await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', signIn())
        .send({
            title: "Updated title",
            price: 300
        }).expect(401);
})

it("Correctly updates a ticket", async () => {
    const cookie = signIn();

    // Creating a ticket with one userId
    const response = await request(app)
        .post('/api/tickets/new')
        .set('Cookie', cookie)
        .send({
            title: 'A valid title',
            price: '200'
        });

    const ticketId = response.body.id;

    const newTitle = "Updated title";
    const newPrice = 600;

    // Trying to update it using same user.
    const updateResponse = await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        }).expect(201);

    expect(updateResponse.body.title).toEqual(newTitle);
    expect(updateResponse.body.price).toEqual(newPrice);
})


it("Emits an event after updating a ticket", async () => {
    const cookie = signIn();

    const response = await request(app)
        .post('/api/tickets/new')
        .set('Cookie', cookie)
        .send({
            title: 'A valid title',
            price: '200'
        });

    const ticketId = response.body.id;

    const newTitle = "Updated title";
    const newPrice = 600;

    await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});