const { configDotenv } = require("dotenv");
const { Sequelize } = require("sequelize");

configDotenv.apply();
const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_DIALECT, DB_HOST, DB_PORT } =
  process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database has been authenticated and Connected!! ✅");
  } catch (error) {
    console.log("Error while connecting Database! ", error);
  }
};

module.exports = { connectDatabase, sequelize };
