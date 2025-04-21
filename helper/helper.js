const bcrypt = require('bcrypt');

const hashPassword = async   ({value}) => {
    const saltRounds = 10;
    const newPass   = await bcrypt.hash(value,10)
    return newPass;
}
const checkPassword  = async ({password , userPassword }) => {
    return  bcrypt.compare(password , userPassword);
}
module.exports = { hashPassword , checkPassword}