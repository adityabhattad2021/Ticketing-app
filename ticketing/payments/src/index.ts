import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { natsWrapper } from "./nats-wrapper";


const start = async ()=>{
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY_MUST_BE_DEFINED');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI_MUST_BE_DEFINED');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID_IS_NEEDED');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NAT_CLUSTER_ID_IS_NEEDED');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL_IS_REQUIRED');
    }
    try {
        // connecting to the NATS client.
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // event listeners
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log('[SUCCESSFULLY_CONNECTED_TO_MONGOOSE]');
    }catch(error){
        console.log('[ERROR_CONNECTING_TO_MONGODB/NATS_SERVER]',error);
    }
    app.listen(3000,()=>{
        console.log('Listening on port 3000!');
    })
}

start();