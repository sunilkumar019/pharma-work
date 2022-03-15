// for sending email
const fs = require("fs");
const nodeMailer = require('nodemailer');
const moment = require("moment");
const path = require("path");

module.exports = async(data) => {

    if(process.env.ENABLE_MAIL == "true"){

        let transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
        let mailOptions = {
            to: data.To,
            from: process.env.FROM_EMAIL,
            subject: data.Subject,
            html: data.Body
        };
        let resp = await transporter.sendMail(mailOptions);
        if (resp) {
            let currDate = new Date();
            let sentInfo = `\n(${moment(currDate).format("LLL")}) - FROM: ${mailOptions.from} - TO: ${mailOptions.to} - APP NAME: ${process.env.APP_NAME} - SUBJECT: ${mailOptions.subject} `;
            
            var appDir = path.dirname(require.main.filename);
            let basePath = appDir.substring(0, appDir.lastIndexOf('/'));
            
            let EmailLogs = 'EmailLogs.txt';
            let EmailLogsPath = `${basePath}/${EmailLogs}`;
            if(!fs.existsSync(EmailLogsPath)) fs.writeFileSync(EmailLogsPath,sentInfo );
            else fs.appendFileSync(EmailLogsPath,sentInfo );
            return "Mail sent successfully!!!";
        } else {
            return "Something went wrong, Please try again!!!";
        }
    }
    else{
        return "Mail Disabled by Admin";
    }
    
}