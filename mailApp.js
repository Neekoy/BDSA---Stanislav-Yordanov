const nodemailer = require('nodemailer');
const mailConfig = require('./mailConfig');
const EmailContent = require('./models/emailcontent');
const async = require('async');


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

module.exports.sendMessage = function(mailData, webinar) {

    if (webinar === 1) {
        databaseId = "59b16afc9e4b05c12a49f512";
    } else {
        databaseId = "59b16bbb9eeca7192da347f1";
    }

  async.waterfall([
    function(callback){
      console.log("DIASJDSAIJ");
      EmailContent.findById(databaseId, function(err, doc) {
        console.log("EMAILING " + doc);
        mailSubject = doc.subject;
        mailContent = doc.content;
        console.log("DAISJDSAIDSAJAS");
        callback(null, mailSubject, mailContent);
      });
    },
    function(mailSubject, mailContent, callback) {

    let mailOptions = {
    	from: '"BDSA" <autoemail@esrhost.com>',
    	to: mailData,
        subject: mailSubject,
        text: mailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                   return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            callback();
    });
    }
  ]);


}
