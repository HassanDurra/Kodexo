const express  = require('express');
const { authenticate, send_verification, verify_code, reset_password } = require('../controller/authenticationController');
const authenticationRoutes   = express.Router();

authenticationRoutes.post('/authenticate', authenticate );
authenticationRoutes.post('/send/verification', send_verification );
authenticationRoutes.post('/verify/code', verify_code );
authenticationRoutes.post('/reset/password', reset_password );
module.exports = {authenticationRoutes};
