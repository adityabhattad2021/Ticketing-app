jest.mock('../nats-wrapper');
jest.mock('../queues/expiration-queue.ts');



beforeEach(async ()=>{
    // clear all the fake function implementation data
    jest.clearAllMocks();

})


afterAll(async()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
})