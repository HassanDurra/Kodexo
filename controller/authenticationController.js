const { LoginAuthentication } = require("../model/loginAuthentication");
const { User } = require("../model/userModel");
const  bcrypt   = require('bcrypt');
const crypto = require('crypto');
const authenticate = async ( req , res  ) => {
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



module.exports = { authenticate };

