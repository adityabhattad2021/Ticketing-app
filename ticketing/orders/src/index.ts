import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListner, TicketUpdatedListner, ExpirationCompletedListener } from "./events/listener";


const start = async () => {
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
            process.env.NATS_URL
        );

        process.on('SIGINT', () => natsWrapper.close());
        process.on('SIGTERM', () => natsWrapper.close());

        // Initializing the event listners
        new TicketCreatedListner(natsWrapper.jsClient).listen();
        new TicketUpdatedListner(natsWrapper.jsClient).listen();
        new ExpirationCompletedListener(natsWrapper.jsClient).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log('[SUCCESSFULLY_CONNECTED_TO_MONGOOSE]');
    } catch (error) {
        console.log('[ERROR_CONNECTING_TO_MONGODB/NATS_SERVER]', error);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    })
}

start();