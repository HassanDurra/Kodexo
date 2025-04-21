
const nodemailer = require('nodemailer');
const {configDotenv}     = require('dotenv');
configDotenv.apply();


const { MAIL_PORT , MAIL_HOST , MAIL_USER , MAIL_PASSWORD , MAIL_MAILER , MAIL_FROM_NAME }  = process.env;

const mailTransporter = nodemailer.createTransport({
    host: MAIL_HOST,         
    port: MAIL_PORT,    
    secure: true,       
    auth: {
        user: MAIL_USER,     
        pass: MAIL_PASSWORD,  
    },
    tls: {
        rejectUnauthorized: false
    }
});

const send_email = async ({ to , from , subject , html = '', message = '' }) => {
    try{
        const sendMail  = await mailTransporter.sendMail({
            from : from ,
            to   : to ,
            subject : subject ,
            text  : message ,
            html : html,
        })
       
        return true ;    
    }
    catch(error){
        return error ;
    }
}


module.exports = { send_email , mailTransporter};