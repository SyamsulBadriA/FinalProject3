const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

function authentication(req, res, next) {
    const token = req.headers.token;
    const decodedUser = verifyToken(token);

    User.findOne({
        where: {
            id: decodedUser.id,
            email: decodedUser.email,
            role: decodedUser.role
        }
    }).then(user => {
        if(!user) {
            return res.status(401).json({
                name: "Unauthenticated",
                message: "Please Login First"
            })
        }
        res.locals.user = user;
        return next();
    }).catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = authentication;