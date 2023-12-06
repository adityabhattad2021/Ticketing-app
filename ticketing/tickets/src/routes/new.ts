import express, {Request,Response} from "express";
import { RequireAuth,ValidateRequest } from "@gittix-microservices/common";
import { body, validationResult } from "express-validator";


const router = express.Router();

router.post(
    '/api/tickets',
    RequireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
            
        body('price')
            .custom(value=>{
            const floatVal = parseFloat(value);
            if(floatVal<0){
                throw new Error('Negative price not expected');
            }
        })
    ],
    ValidateRequest,
    (req:Request,res:Response)=>{
    res.sendStatus(200);
})

export {router as createTicketRouter};