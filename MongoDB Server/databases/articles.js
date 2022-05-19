const mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect
//var url = 'mongodb://localhost:27017/test';
const mongoDB = 'mongodb://127.0.0.1/articles';

mongoose.Promise = global.Promise;

/**
 * Connecting to mongoDB
 * @type {*|Promise<any>}
 */
connection = mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    checkServerIdentity: false,
})
    .then(() => {
        console.log('connection to mongodb worked!');
    })
    .catch((error) => {
        console.log('connection to mongodb did not work! ' + JSON.stringify(error));
    });