
const mongoose  = require("mongoose");

mongoose.Promise = Promise;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 10000, 
    bufferMaxEntries : 0,
    bufferCommands: false,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 1,
    socketTimeoutMS: 0,
    keepAlive: true
};


mongoose.connection.on('connected', () => {
    console.log('******** Datbase Connection Established ********');
})

mongoose.connection.on('reconnected', () => {
    console.log('******** Datbase Connection Re-established ********')
})

mongoose.connection.on('disconnected', () => {
    console.log('******** Datbase Connection Disconnected ********')
})

mongoose.connection.on('close', () => {
    console.log('******** Datbase Connection Closed ********')
})

mongoose.connection.on('error', async (error) => {
    console.log('******** Datbase Connection ERROR ******** \nError: ' + error);
    // await mongoose.connect(`${process.env.DB_URL}`,options);
    // console.log('******** Datbase Connection Restarted again after timeout ********')
})

module.exports = async () => {
    await mongoose.connect( `${process.env.DB_URL}`,options).catch(err => console.log("ERROR\n",err.reason));;
};



// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
       process.exit(0);
    });
});
