import request from "supertest";
import { app } from "../../app";


it("Responds with details about the current user", async () => {
    const cookie = await global.signup();

    const response = await request(app)
        .get("/api/users/currentUser")
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com');

})


it("Responds with null if the user is not authenticated",async ()=>{
    const response = await request(app)
        .get("/api/users/currentUser")
        .send()
        .expect(200)

    expect(response.body.currentUser).toBeNull();
})