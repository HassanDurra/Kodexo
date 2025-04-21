const { Model , DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');   

class LoginAuthencation extends Model {};

LoginAuthencation.init(
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
        tableName:'login_authentications'

    }
)
module.exports = {LoginAuthencation}