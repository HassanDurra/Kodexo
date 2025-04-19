const express = require('express');
const { router } = require('./routes/router');
const { connectDatabase, sequelize } = require('./config/dbConnect');
const { User } = require('./model/userModel');
const multer  = require('multer');
const upload = multer() ;
const app = express();
app.use(upload.any());
app.use(express.urlencoded());
app.use('/', router );
app.listen(3000 , async()=>{

    await sequelize.sync({alter:true});

    connectDatabase();
});