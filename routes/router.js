const express = require('express');
const { register } = require('../controller/authenticationController');
const { insert } = require('../controller/userController.js');
const router  =  express.Router();

router.post('/create/user', insert);
// Authentication Routes 
module.exports = {router};