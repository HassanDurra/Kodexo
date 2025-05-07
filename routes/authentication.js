const express = require("express");
const {
  authenticate,
  send_verification,
  verify_code,
  reset_password,
} = require("../controller/authenticationController");
const multer = require("multer");
const upload = multer(); 
const authenticationRoutes = express.Router();
authenticationRoutes.use(upload.any(true));
authenticationRoutes.post("/authenticate", authenticate);
authenticationRoutes.post("/send/verification", send_verification);
authenticationRoutes.post("/verify/code", verify_code);
authenticationRoutes.post("/reset/password", reset_password);
module.exports = { authenticationRoutes };
