import { OrderStatus } from "@gittix-microservices/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    id:string;
    status:OrderStatus;
    userId:string;
    price:number;
    version:number;
}

interface OrderDoc extends mongoose.Document {
    id:string;
    status:string;
    version:number;
    userId:string;
    price:number;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attributes:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:Object.values(OrderStatus),
        default:OrderStatus.Created
    },
    price:{
        type:Number,
        required:true,
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (orderAttributes:OrderAttrs)=>{
    return new Order({
        _id:orderAttributes.id,
        userId:orderAttributes.userId,
        status:orderAttributes.status,
        price:orderAttributes.price,
        version:orderAttributes.version,
    });
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);


export {Order};