import mongoose, { mongo } from "mongoose";
import { TicketDoc } from "./common/ticket-document";
import { Order } from "./order";
import { OrderStatus } from "@gittix-microservices/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr{
    id:string;
    title:string;
    price:number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attr:TicketAttr):TicketDoc;
    findByEvent(event:{id:string,version:number}):Promise<TicketDoc | null>;
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

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent=(event:{id:string,version:number})=>{
    return Ticket.findOne({
        _id:event.id,
        version:event.version-1
    })
}   

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