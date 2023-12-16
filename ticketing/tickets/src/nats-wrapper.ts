import nats,{ Stan } from "node-nats-streaming";

class NatsWrapper {
    private _client?:Stan;

    get client(){
        if(!this._client){
            throw new Error('Cannot access NATS client');
        }
        return this._client;
    }

    connect(clusterId:string,clientId:string,url:string){
        this._client = nats.connect(clusterId,clientId,{url});

        return new Promise<void>((resolve,reject)=>{
            this.client.on('connect',()=>{
                console.log('Successfully connected to the NATS client!');
                resolve();
            })
            this.client.on('error',(err)=>{
                console.log('There was an error while connecting to the NATS client');
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();