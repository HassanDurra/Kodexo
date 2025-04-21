const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../config/dbConnect');
class Verification extends Model {}; 

Verification.init({
    email: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    code : {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
},{
    sequelize,
});
module.exports =  { Verification };