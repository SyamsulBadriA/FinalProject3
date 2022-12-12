const { User } = require('../models');

class Authorization {
    static async authorizeUser(req, res, next) {
        const authenticatedUser = res.locals.user;
        const id = req.params.id;

        await User.findOne({
            where: {
                id
            }
        }).then(user => {
            if(!user) {
                return res.status(404).json({
                    name: "Resource not Found",
                    message: `User with id ${id} not Found on Database`
                });
            } else {
                if(user.id === authenticatedUser.id) {
                    res.locals.paramsId = id;
                    return next()
                }
                return res.status(403).json({
                    name: "Forbidden Unauthorized",
                    message: "You does not have Authorization to Edit this Resource"
                });
            }
        }).catch(err => {
            return res.status(500).json(err);
        })
    }

    static async authorizeAdmin(req, res, next) {
        const authenticatedUser = res.locals.user;

        await User.findOne({
            where: {
                id: authenticatedUser.id
            }
        }).then(user => {
            if(!user){
                return res.status(404).json({
                    name: "User not Found",
                    message: "User Not Found in Database"
                })
            } else {
                if(user.role === 0) {
                    return next();
                } else {
                    return res.status(403).json({
                        name: "Forbidden Error",
                        message: "Must be an Admin to edit this resource"
                    })
                }
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = Authorization;