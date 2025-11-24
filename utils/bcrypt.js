const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(password, salt);
    return hashedPassword;

};

exports.comparePassword = async (input, hashedPassword) => {
    const result = await bcrypt.compare(input, hashedPassword);
    return result;
};