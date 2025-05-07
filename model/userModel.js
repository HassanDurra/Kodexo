const { Sequelize, DataTypes, Model, INTEGER } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(50), // Match length from picture
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100), // Match length from picture
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT, // Match data type from picture
      allowNull: false,
    },
    user_role: {
      type: DataTypes.STRING(20), // Match length from picture
      defaultValue: "user", // Match default value from picture
    },
    image: {
      type: DataTypes.STRING(255), // Match length from picture
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER, // Match data type from picture
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER, // Match data type from picture
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE, // Match data type from picture
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.INTEGER, // Match data type from picture
      allowNull: true,
    },
    email_verified: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize, // Connection Instance For DB connection to Model
    timestamps: true,
    paranoid:true,
    modelName: "User",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt:"deleted_at",
  }
);
User.belongsTo(User, {
  foreignKey: 'deleted_by',
  as: 'DeletedByUser',
});
module.exports = { User };
