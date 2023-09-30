import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { BadRequestError, } from "../errors";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { ValidateRequest } from "../middlewares";

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 to 20 characters'),
],
ValidateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        
        const existingUser = await User.findOne({
            email: email
        })

        if (existingUser) {
            console.log('Email Already in Use');
            throw new BadRequestError('User with this email already exists');
        }

        const user = User.build({
            email: email,
            password: password
        });

        await user.save();

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        // Store it on the session object
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user);

    })

export { router as signUpRouter };