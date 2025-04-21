const { User } = require("../model/userModel");
const  bcrypt   = require('bcrypt');
const authenticate = async ( req , res  ) => {
    const { email , password } = req.body;
    const checkUser = await User.findOne({ where: { email } });
    if(!checkUser){
        return res.status(200).json({'message':'Incorrect email ..!','type':'error'})
    }
    const isPasswordMatched = await bcrypt.compare(password , checkUser.password);

    if(!isPasswordMatched){

            return res.json({'message':'User Found SuccessFully!' , 'type':'success'});

     }
    else{
        return res.status(200).json({'message':'Incorrect email or password ..!','type':'error'})
    }
}



module.exports = { authenticate };

