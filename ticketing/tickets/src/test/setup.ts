import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global{
    var signIn:()=>string[];
}

jest.mock('../nats-wrapper');

let mongo:any;
beforeAll(async ()=>{
    process.env.JWT_KEY='abcd';
    mongo = await MongoMemoryServer.create({
        binary:{
            version:'6.0.4'
        }
    })
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri,{});
})


beforeEach(async ()=>{

    // clear all the fake function implementation data
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({})
    }
})


afterAll(async ()=>{
    if(mongo){
        await mongo.stop();
    }
    await mongoose.connection.close();
})


global.signIn = () =>{
    const randomId = new mongoose.Types.ObjectId().toHexString()
    const payload = {
        // id:'1234567890',
        id:randomId,
        email:'test@test.com'
    }
    const token = jwt.sign(payload,process.env.JWT_KEY!);

    const session = {jwt:token};

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}