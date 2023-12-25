import mongoose from "mongoose";

export interface TicketDoc extends mongoose.Document {
    title:string;
    price:number;
    isReserved():Promise<boolean>;
    version:number;
}