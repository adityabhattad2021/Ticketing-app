import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global{
    var signIn:()=>string[];
}


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
    // const collection = await mongoose.collection.db.collections();

    // for(let collection of collections){
    //     await collection.deleteMany({})
    // }
})


afterAll(async ()=>{
    if(mongo){
        await mongo.stop();
    }
    // await mongoose.collection.close();
})


global.signIn = () =>{
    const payload = {
        id:'1234567890',
        email:'test@test.com'
    }
    const token = jwt.sign(payload,process.env.JWT_KEY!);

    const session = {jwt:token};

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}