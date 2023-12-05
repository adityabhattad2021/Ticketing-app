import request from "supertest";
import { app } from "../../app";

it("Has a route handler listening to /api/tickets for post requests", async () => {

});

it("Can only be accessed if the user is signed in", async ()=>{

})


it("Returns an error if an invalid title is provided",async ()=>{

})


it("Returns an error if an invalid price is provided",async ()=>{
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
})


it("Creates a ticket with valid inputs",async ()=>{

})


