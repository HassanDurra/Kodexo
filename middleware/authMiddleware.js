const { LoginAuthentication } = require("../model/loginAuthentication");

const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    let unAuthorized = false;
    if (!token) {
        unAuthorized = true;
    } else {
        const loggedIn = await LoginAuthentication.findOne({ where: { token } });
        if (!loggedIn) {
            unAuthorized = true;
        }
    }
    if (unAuthorized) {
        return res.status(403).json({ message: "Invalid token", type: 'error' });
    }
    next();
};
module.exports = {checkToken}