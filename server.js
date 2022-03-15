require('dotenv').config();
const fileStream = require("fs");
//creates database connection
(async () => {
    db = await require("./core/db");
    await db();
})();

//function that will check all the passed .env variables are set
//if any is missing then it will terminate the server
((names) => {
    let shouldExit = false
    for (let i = 0; i < names.length; i++) {
        if (!process.env[names[i]]) {
            shouldExit = true
            console.log(`Missing ${names[i]} in .env`)
        }
    }
    if (shouldExit) {
        console.log('*************Server Terminates**************')
        process.exit(0)
    }
})([
    'DB_URL',
    'BASE_URL',
    'PORT',
    'APP_NAME',
    'ADMIN_ADD_TOKEN',
    'NOTIFICATION_STATUS',
    'PRODUCTION',

    'ENABLE_MAIL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'FROM_EMAIL',
    'APP_LIVE_LINK'
])
let path = require('path');

let httpx = require('./httpx');
//intialize and start express server
const express = require('express');
const app = express();


let options = {
    cert: fileStream.readFileSync(path.join(__dirname, "..", "..", "sslfiles", "ssl.cert")),
    key: fileStream.readFileSync(path.join(__dirname, "..", "..", "sslfiles", "ssl.key")),
    ca: fileStream.readFileSync(path.join(__dirname, "..", "..", "sslfiles", "ssl.ca"))
}
let http = httpx.createServer(options, app);

// app.use (function (req, res, next) {
//     if (req.secure) {
//         // request was via https, so do no special handling
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

//require morgan for request logging
const morgan = require("morgan");
app.use(morgan("dev"));

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "Content-Range")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.static(__dirname + '/pharma_dashboard/build'));
app.use('/core/uploads/products/img', express.static('core/uploads/products/img'));
app.use('/core/uploads/products/vis', express.static('core/uploads/products/vis'));
app.use('/core/uploads/products/techDetails', express.static('core/uploads/products/techDetails'));
app.use('/core/uploads/franchisee', express.static('core/uploads/franchisee'));
app.use('/core/uploads/offers', express.static('core/uploads/offers'));
app.use('/core/uploads/download', express.static('core/uploads/download'));
app.use('/core/uploads/admin', express.static('core/uploads/admin'));
app.use('/core/uploads/reps', express.static('core/uploads/reps'));
app.use('/core/uploads/companyAbout', express.static('core/uploads/companyAbout'));
app.use('/core/uploads/promotinalPics', express.static('core/uploads/promotinalPics'));
app.use('/assets/images', express.static('assets/images'));
app.use('/core/uploads/certificates', express.static('core/uploads/certificates'));


let appApi = require('./api/app/routes');
let webApi = require("./api/web/routes");

app.use('/api/app/', appApi)
app.use('/api/web/', webApi)
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/pharma_dashboard/build');
});

require("./birthday_notification/index.js")
let fs = require("./core/lib/FileStream.js");


fs.createConstantfileinFrontEnd('pharma_dashboard/src/constants.js');
fs.createEssentialDirectories();

/////////importing state cities/////////////////
let stateCityCtrl = require("./core/controllers/stateCity");
stateCityCtrl.bulkAddStateCities();

//app.listen(process.env.PORT, () => console.log('Rep Server Running...'))
http.listen(process.env.PORT, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`${process.env.APP_NAME} server started on port ${process.env.PORT}`);
    }
});
