const { LoginAuthentication } = require("../model/loginAuthentication");
const { User } = require("../model/userModel");
const  bcrypt   = require('bcrypt');
const { configDotenv }   = require('dotenv');
const crypto = require('crypto');
const { Verification } = require("../model/verification");
const { send_email, mailTransporter } = require("../config/mailConfig");

configDotenv.apply();

const authenticate = async ( req , res  ) => {
    try{
        const { email , password } = req.body;
        const checkUser = await User.findOne({ where: { email } });
        if(!checkUser){
            return res.status(200).json({'message':'Incorrect email ..!','type':'error'})
        }
        const isPasswordMatched = await bcrypt.compare(password , checkUser.password);

        if(isPasswordMatched){
                if(!checkUser.email_verified){
                    const authToken = crypto.randomBytes(20).toString("hex") ;
                    const userData  = await LoginAuthentication.findOne({ where: { email } });
                    if (userData) {
                        await LoginAuthentication.update(
                            { token: authToken },
                            { where: { email } }
                        );
                    }
                    else{
                        await LoginAuthentication.create({
                            email:email,
                            token:authToken,
                        });
                    }
                    return res.json({'message':'User Found SuccessFully!' , 'type':'success' , authToken:authToken});
                }
                else{
                    return res.status(403).json({'message':'Account is not verified!', type:'unverified'})
                }
        }
        else{
            return res.status(200).json({'message':'Incorrect email or password ..!','type':'error'})
        } 
    }
    catch(error){
        const errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        return res.status(500).json({ 'message': errorMessage });
    }
}

const send_verification = async ( req , res ) => {
   try{
        const { email } = req.body;
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const mailConfig  = {
            to : email ,
            from : process.env.MAIL_FROM_ADDRESS ,
            subject : 'Account Verification Code',
            html : `<b> this is your verification Code : ${verificationCode} </b>`
        };
        // Remove Previous Code 
        Verification.destroy({where:{ email : email }});
        const storeVerification   = await Verification.create({
            email : email ,
            code : verificationCode ,
        });
        if(storeVerification){
            const sendingMail = send_email(mailConfig);
            return res.json({'message':'Verification code has been sent check your email...!' ,'type' : 'success'});
        }
        else{
            return res.json({'message':'Failed to Send Verification...!' , type : 'error'});
        } 
    }
    catch (error) {
        const errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        return res.status(500).json({ 'message': errorMessage });
    }
};

const verify_code = async ( req , res) => {
   try{
        const { code , email } =  req.body;
        const checkCode  = await Verification.findOne({where:{email : email , code: code }});
        if(checkCode){
            await checkCode.destroy();
            const updateUser  = await User.update({
                email_verified : 1 
            } , { where:{ email } });
            return res.status(200).json({"message":"Verification successful! " , "type":"success"});
        }
        else{
            return res.status(500).json({"message":"Failed to Verify Code! " , "type":"error"});
        }
    } catch (error) {
        const errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        return res.status(500).json({ 'message': errorMessage });
    }
}
module.exports = { authenticate , send_verification , verify_code};

