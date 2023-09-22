import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError{
   
    statusCode=400;
    public message:string;

    constructor(message:string){
        super(message);
        this.message=message;

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors(): { message: string; feild?: string | undefined; }[] {
        return [{
            message:this.message
        }]
    }

}