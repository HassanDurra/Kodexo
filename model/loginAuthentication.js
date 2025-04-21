const { Model , DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');   

class LoginAuthentication extends Model {};

LoginAuthentication.init(
    {
        email:{
            allowNull:false,
            type:DataTypes.STRING,
        },
        token:{
            allowNull:false,
            type:DataTypes.TEXT,
        }
    },{
        sequelize,
    }
)
module.exports = { LoginAuthentication }