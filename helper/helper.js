const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const hashPassword = async   ({value}) => {
    const saltRounds = 10;
    const newPass   = await bcrypt.hash(value,10)
    return newPass;
}
const checkPassword  = async ({password , userPassword }) => {
    return  bcrypt.compare(password , userPassword);
}
const fileUpload  = ({fileDestination}) => {
    const destinationPath = path.join(__dirname, '../uploads', fileDestination);
    fs.mkdirSync(destinationPath, { recursive: true });
    const storage = multer.diskStorage({
        destination:(req , file , cb) => {
            return cb(null , destinationPath);
        },
        filename:(req , file , cb) => {
            return cb(null, `${file.originalname.toLowerCase().replace(/\s+/g, '-')}`);
        }
    })
    return storage ;
}

const generateFileURL =  ({req ,fileDestination, filename}) => {
    const name = `${req.protocol}://${req.get("host")}/uploads/images/${fileDestination}/${filename.toLowerCase().replace(/\s+/g, '-')}`;
    return name;
}
module.exports = { hashPassword , checkPassword , fileUpload, generateFileURL}