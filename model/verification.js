const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');

class Verification extends Model {};

Verification.init({
    
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        code:{
            type:DataTypes.Integer,
            allowNull:false,
        }
    
    },{
        sequelize ,
        tableName:"verifications"
    }
);
module.exports = {Verification}