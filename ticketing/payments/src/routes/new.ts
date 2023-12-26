import { RequireAuth, ValidateRequest } from "@gittix-microservices/common";
import express,{Request,Response} from "express";
import { body } from "express-validator";


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
        res.send(200);
    }
)


export {router as createPaymentRouter};