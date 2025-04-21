const express  = require('express');
const { authenticate } = require('../controller/authenticationController');
const authenticationRoutes   = express.Router();

authenticationRoutes.post('/authenticate', authenticate );

module.exports = {authenticationRoutes};
