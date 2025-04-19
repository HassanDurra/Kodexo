const { hashPassword } = require("../helper/helper");
const { User } = require("../model/userModel")
const bcrypt = require('bcrypt');

const insert = async (req, res) => {

    try {
        const { name, email, password, userName, image, role } = req.body;
        
        const hashedPassword = await hashPassword({ value: password });

        const createData = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            userName: userName,
            image: image ? image : null,
        }

        await User.create(createData);
        return res.status(200).json({ 'message': `User with Name: '${name}' and Email: '${email}' has been Created!` });
    }
    catch (error) {
        const errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        return res.status(500).json({ 'message': errorMessage });
    }
}
module.exports = { insert };