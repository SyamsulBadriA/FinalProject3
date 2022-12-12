const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(passwordUser) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(passwordUser, salt)
    return hash;
}

function checkPassword(inputPassword, passwordUser){
    return bcrypt.compareSync(inputPassword, passwordUser);
}

module.exports = {
    hashPassword,
    checkPassword
}