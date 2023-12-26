import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async ()=>{
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID_IS_NEEDED');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NAT_CLUSTER_ID_IS_NEEDED');
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL_IS_REQUIRED');
    }

    try{
        // Connect to NATS client.
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed');
            process.exit();            
        })
        process.on('SIGINT',()=>natsWrapper.client.close());
        process.on('SIGTERM',()=>natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        
    }catch(error){
        console.log('[ERROR_CONNECTING_TO_REDIS/NATS_SERVER',error);   
    }
}


start();