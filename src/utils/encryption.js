const bcrypt = require("bcrypt");

const encryptPassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashPassword;
};

module.exports = { encryptPassword };
