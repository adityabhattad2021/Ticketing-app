import request from "supertest";
import { app } from "../../app";


export default async function createTestTicket() {
    const response = await request(app)
        .post('/api/tickets/new')
        .set('Cookie', signIn())
        .send({
            title: 'Test ticket',
            price: '100'
        });
    return response.body;
}