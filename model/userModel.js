const {Sequelize , DataTypes, Model}  = require('sequelize');
const { sequelize } = require('../config/dbConnect');
class User extends Model{};

User.init({
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false,

        },
        email:{
            type: DataTypes.STRING,
            unique:true,
            allowNull: false,

        },
        password:{
            type:DataTypes.TEXT,
            allowNull: false,

        },
        role:{
            type:DataTypes.INTEGER,
            defaultValue:0,
        },
        userName:{
            type:DataTypes.STRING,
            unique:true,
            allowNull: false,

        },
        image:{
            type:DataTypes.TEXT,
            allowNull: true,
        }
      
    },
    {
        sequelize, // Connection Instance For DB connection to Model 
        modelName:'User',
         
    }
);
module.exports = { User };