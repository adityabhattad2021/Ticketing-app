import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successful signup", async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        }).expect(201);
});

it("Returns a 400 with an invalid email",async ()=>{
    return request(app)
        .post("/api/users/signup")
        .send({
            email:"assdadad",
            password:"adsasdas"
        })
        .expect(400);
})

it("Returns a 400 with an invalid password",async ()=>{
    return request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:'a'
        })
        .expect(400);
})

it("Returns a 400 for an empty request",async ()=>{
    return request(app)
        .post("/api/users/signup")
        .send({})
        .expect(400);
})

it("disallows duplicate emails",async ()=>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"1234"
        })
        .expect(400);
})


it("Sets a cookie after successfull signup",async ()=>{
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"password"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
})

