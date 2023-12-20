import mongoose, { mongo } from "mongoose";
import { TicketDoc } from "./common/ticket-document";
import { Order } from "./order";
import { OrderStatus } from "@gittix-microservices/common";

interface TicketAttr{
    id:string;
    title:string;
    price:number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attr:TicketAttr):TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.statics.build = (ticketAttributes:TicketAttr)=>{
    return new Ticket({
        _id:ticketAttributes.id,
        title:ticketAttributes.title,
        price:ticketAttributes.price
    });
}

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{
            $in:[
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    })
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);


export {Ticket};