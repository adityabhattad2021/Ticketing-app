import request from "supertest";
import { app } from "../../app";


it("Fails when a email that does not exists is supplied",async ()=>{
    await request(app)
            .post('/api/users/signin')
            .send({
                email:"test@test.com",
                password:"password"
            })
            .expect(400);
})


it("Fails when an incorrect password is supplied",async ()=>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"password"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signin")
        .send({
            email:"test@test.com",
            password:"password1"
        })
        .expect(400)

})  

it("Successfully submits a Cookie when signed it correctly",async ()=>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test1@test.com",
            password:"password"
        })
        .expect(201)

        const response=await request(app)
                .post("/api/users/signin")
                .send({
                    email:"test1@test.com",
                    password:"password"
                })
                .expect(200)

    expect(response.get("Set-Cookie")).toBeDefined();

})