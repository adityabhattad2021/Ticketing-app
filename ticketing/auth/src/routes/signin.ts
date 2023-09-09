import express from "express";

const router = express.Router();

router.post('/api/users/signin',(req,res)=>{
    res.status(200).send('hi, there👋')
})

export {router as signInRouter}