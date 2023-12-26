import Queue from "bull";
import { queueName } from "./constant/queue-name";

interface Payload {
    orderId:string;
}

const expirationQueue = new Queue<Payload>(queueName,{
    redis:{
        host:process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job)=>{
    // publish expiration complete event.
})

export {expirationQueue};