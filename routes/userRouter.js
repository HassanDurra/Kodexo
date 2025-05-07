const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  restoreUser,
  userStatus,
  getDeletedUsers,
  restoreMultipleUsers,
  destroyUser,
  destroyMultipleUsers,
} = require("../controller/userController");
const multer = require("multer");
const { fileUpload } = require("../helper/helper");
const userRouter = express.Router();
const upload = multer({storage:fileUpload({fileDestination:'images/users'})});
userRouter.use(upload.any(true));
userRouter.post("/create-user", createUser);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/get-user/:user_id", getUserById);
userRouter.put("/update-user/:user_id", updateUser);
userRouter.put("/delete-user/:user_id", deleteUser);
userRouter.put("/destroy-user/:user_id", destroyUser);
userRouter.get("/trash-user", getDeletedUsers);
userRouter.post("/delete-multiple-users", deleteMultipleUsers);
userRouter.post("/destroy-multiple-users", destroyMultipleUsers);
userRouter.post("/restore-multiple-users", restoreMultipleUsers);
userRouter.put("/restore-trash-user/:user_id", restoreUser);
userRouter.put("/update-status/:id", userStatus);
// Authentication Routes
module.exports = { userRouter };
