import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {

    statusCode = 400;
    public errors:ValidationError[]

    constructor(errors: ValidationError[]){
        // Only for logging purposes, we pass a string in the constructor.
        super('Invalid request parameters');
        this.errors=errors;
        // Only because we are extending a built in class.
        Object.setPrototypeOf(this,RequestValidationError.prototype);
    }

    serializeErrors(){
       return this.errors.map(error=>{
            if(error.type==='field'){
                return {
                    message:error.msg,
                    field:error.path
                }
            }
            return {message:error.msg}
       }) 
    }
}