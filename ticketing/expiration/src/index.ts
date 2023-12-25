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
        // Connect to Redis.
    }catch(error){
        console.log('[ERROR_CONNECTING_TO_REDIS/NATS_SERVER',error);   
    }
}


start();