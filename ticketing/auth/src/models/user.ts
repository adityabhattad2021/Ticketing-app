import mongoose from "mongoose";

// An interface that describes the properties that are required to create a new user. 
interface UserAttributes {
    email:string;
    password:string;
}

// An interface that describe the properties that user model should have.
interface UserModel extends mongoose.Model<UserDocument> {
    build(userAttributes:UserAttributes):UserDocument;
} 

// An interface that describe the properties that a user document has.
interface UserDocument extends mongoose.Document {
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.build = (userAttributes:UserAttributes)=>{
    return new User({
        email:userAttributes.email,
        password:userAttributes.password,
    })
}

const User = mongoose.model<UserDocument,UserModel>('User', userSchema);

export { User };