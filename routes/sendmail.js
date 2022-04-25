require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const sendemail = (to, from, subject, text) => {

    const msg = {
        to,
        from,
        subject,
        html: text,
    }

    
    sgMail.send(msg, function(err,result){
        if(err){
            console.log('Email not sent');
        }
        else {
    
            console.log('Email sent successfully');
	    }
    });

};


module.exports = sendemail;