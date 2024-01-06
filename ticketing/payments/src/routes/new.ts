import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, RequireAuth, ValidateRequest } from "@gittix-microservices/common";
import express,{Request,Response} from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();


router.post(
    '/api/payments/new',
    RequireAuth,
    [
        body("token")
            .not()
            .isEmpty(),
        body("orderId")
            .not()
            .isEmpty()
    ],
    ValidateRequest,
    async (req:Request,res:Response)=>{
        const {token,orderId} = req.body;
        const order = await Order.findById(orderId);
        if(!order){
            throw new NotFoundError();
        }
        if(order.userId!==req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        if(order.status===OrderStatus.Cancelled){
            throw new BadRequestError("Cannot pay for cancelled order");
        }

        await stripe.charges.create({
            currency:'inr',
            amount:order.price*100,
            source:token
        });

        await new PaymentCreatedPublisher(natsWrapper.jsClient).publish({
            orderId:order.id,
            price:order.price
        })

        res.send(200);
    }
)


export {router as createPaymentRouter};