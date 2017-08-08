const nodemailer = require('nodemailer');
const mailConfig = require('./mailConfig');
const mailContent = require('./mailContent');


let transporter = nodemailer.createTransport({
    host: mailConfig.sender.host,
    port: mailConfig.sender.port,
    secure: true, // use TLS
    auth: {
        user: mailConfig.sender.authUser,
        pass: mailConfig.sender.authPass
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

module.exports.sendMessage = function(mailData) {

    let mailOptions = {
    	from: '"BDSA" <autoemail@esrhost.com>',
    	to: mailData,
        subject: mailConfig.subject,
        text: mailContent,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                   return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

