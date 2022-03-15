const redis = require("redis");
const client = redis.createClient(6379,"127.0.0.1");
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const checkAsync = promisify(client.exists).bind(client);

exports.saveData = async (key, value,expiry = 900) => {
    try{
        if(!key) {
            return new Error("Key is Required to save Data");
        }
        if(!value) {
            return new Error("value is Required to save Data");
        }
        let rs = await setAsync(key.toString(), value.toString());
        client.expire(key.toString(),expiry);
        //client.set(key.toString(),value.toString())
        return rs;
    }
    catch (e) {
        return new Error("Something went wrong while saving data");
    }
}

exports.getData = async (key) => {
    try{
        if(!key) {
            return new Error("Key is Required to get Data");
        }

        let keyCheck = await checkAsync(key.toString());
        if(keyCheck == 1){
            let rs = await getAsync(key.toString());
            return rs;
        }
        else{
            return null;
        }
    }
    catch (e) {
        return new Error("Something went wrong while getting data");
    }
}
