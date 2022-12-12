const jwt = require('jsonwebtoken');

const SECRET = 'sangatrahasia';

function generateToken(payload) {
    let token = jwt.sign(payload, SECRET);
    return token;
}

function verifyToken(token) {
    let decode = jwt.verify(token, SECRET);
    return decode;
}

module.exports = {
    generateToken,
    verifyToken
}