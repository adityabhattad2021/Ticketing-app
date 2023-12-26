import Queue from "bull";
import { queueName } from "./constant/queue-name";
import { ExpirationCompletedPublisher } from "../events/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    await new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId:job.data.orderId,
    })
})

export {expirationQueue};