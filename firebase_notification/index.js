const firebase = require("firebase-admin");

const serviceAccount = require('./admin-sdk.json');

if(process.env.FIREBASE_DB_URL){
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DB_URL
    });
}
else{
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    });
}


module.exports = async(data, filter) => {
    try{
        //var topic = "'Distributors_notification' in topics || 'MRs_notification' in topics";
        if (!data) throw new Error("Data is required to send notification")
        if (!data.title) throw new Error("Data.title is Required to send notification");
        if (!data.message) throw new Error("Data.message is Required to send notification");

        if (!filter) throw new Error("Receipnt is Required i.e(Distributor,MR, Both");
        //  if (!(filter == "Distributor" || filter == "MR" || filter == "Both" || filter.length < 5)) throw new Error("Valid Receipnt is Required i.e(Distributor,MR, Both");
        let sendTo = null;

        sendTo = { token: filter }
        if (filter == "Distributor") sendTo = { topic: "Distributors_notification" }
        if (filter == "MR") sendTo = { topic: "MRs_notification" }
        if (filter == "Both") sendTo = { condition: "'Distributors_notification' in topics || 'MRs_notification' in topics" }

        let filterHead = null;
        for (x in sendTo) filterHead = x;
        var message = {
            data: {
                title: data.title,
                message: data.message
            },
            [filterHead]: sendTo[filterHead]
        };

        let res = await firebase.messaging().send(message)

        if (res) return { Message: "Notification sent successfully!!!" }
        else return { Error: "Something went Wrong while sending Notification!!" }
    }
    catch(e){
        console.log(e)
        return { Error: "Something went Wrong while sending Notification!!" }
    }
}