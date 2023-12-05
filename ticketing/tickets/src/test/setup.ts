import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";


let mongo:any;
beforeAll(async ()=>{
    process.env.JWT_KEY='abcd'
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