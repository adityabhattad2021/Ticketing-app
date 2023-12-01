import express from "express";
import { CurrentUser } from "@gittix-microservices/common";

const router = express.Router();

router.get('/api/users/currentUser', CurrentUser, (req, res) => {
    res.status(200).send({ currentUser: req.currentUser || null });
})

export { router as currentUserRouter };