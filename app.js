const express = require("express");
const { connectDatabase, sequelize } = require("./config/dbConnect");
const multer = require("multer");
const { authenticationRoutes } = require("./routes/authentication");
const { userRouter } = require("./routes/userRouter");
const { categoryRouter } = require("./routes/categoryRouter");
const { fileUpload } = require("./helper/helper");
const cors = require("cors");
const app = express();

const { checkToken } = require("./middleware/authMiddleware");
app.use(express.json());
const path = require("path");
const { storeHeadingRouter } = require("./routes/storeHeadingRouter");
//  This will be used to statically read the files
const staticFiles = path.join(__dirname, "uploads/images");
app.use("/uploads/images", express.static(staticFiles));
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/user-api", checkToken, userRouter);
app.use("/auth", authenticationRoutes);
app.listen(process.env.APP_PORT, async () => {
  await sequelize.sync({ alter: true });
  connectDatabase();
});
