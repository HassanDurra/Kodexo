const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');
class Verification extends Model {}; 

Verification.init({
    email: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    code : {
        type:DataTypes.INTEGER,
        allowNull:true,
        unique:true
    },
   
},{
    sequelize,
});
module.exports =  { Verification };