import { OrderStatus } from "@gittix-microservices/common";
import mongoose from "mongoose";
import { TicketDoc } from "./common/ticket-document";


interface OrderAttrs {
    userId:string;
    status:OrderStatus;
    expiresAt:Date;
    ticket:TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId:string;
    status:string;
    expiresAt:Date;
    ticket:TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:Object.values(OrderStatus),
        default:OrderStatus.Created
    },
    expiresAt:{
        type:mongoose.Schema.Types.Date
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.statics.build = (orderAttributes:OrderAttrs)=>{
    return new Order({
        userId:orderAttributes.userId,
        status:orderAttributes.status,
        expiresAt:orderAttributes.expiresAt,
        ticket:orderAttributes.ticket
    })
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);

export {Order};