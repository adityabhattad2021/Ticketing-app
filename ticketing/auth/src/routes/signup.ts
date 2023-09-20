import express, { Request, Response } from "express";
import { body,validationResult } from 'express-validator';
import { DatabaseConnectionError, RequestValidationError } from "../errors";

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 to 20 characters'),
],
    (req: Request, res: Response) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            throw new RequestValidationError(errors.array());
        }

        const {email,password}=req.body;

        console.log('Creating a user');
        throw new DatabaseConnectionError();

        res.status(200).send('hi, there!')
    })

export { router as signUpRouter };