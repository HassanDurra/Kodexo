const { Model , DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');   

class ResetPassword extends Model {};

ResetPassword.init(
        {id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        },
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
module.exports = { ResetPassword }