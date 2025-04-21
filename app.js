const express = require("express");
const { router } = require("./routes/router");
const { connectDatabase, sequelize } = require("./config/dbConnect");
const { User } = require("./model/userModel");
const multer = require("multer");
const { LoginAuthencation } = require("./model/loginAuthentication");
const { authenticationRoutes } = require("./routes/authentication");
const upload = multer();
const app = express();
app.use(upload.any());
app.use(express.urlencoded());
app.use("/", router);
app.use("/auth", authenticationRoutes);
sequelize.sync({ alter: true });
app.listen(3000, async () => {
  connectDatabase();
});
