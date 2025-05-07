const multer = require("multer");
const { fileUpload } = require("../helper/helper");

const uploadFileMiddleware = ({ fileDestination = 'images', file = 'file' }) => {
    const upload = multer({ storage: fileUpload({ fileDestination }) });
    return upload.single(file);  // 'file' yaha form field ka naam hoga (e.g. 'image')
};

module.exports = { uploadFileMiddleware };