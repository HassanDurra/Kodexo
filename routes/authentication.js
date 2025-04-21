const express  = require('express');
const { authenticate, send_verification, verify_code } = require('../controller/authenticationController');
const authenticationRoutes   = express.Router();

authenticationRoutes.post('/authenticate', authenticate );
authenticationRoutes.post('/send/verification', send_verification );
authenticationRoutes.post('/verify/code', verify_code );
module.exports = {authenticationRoutes};
