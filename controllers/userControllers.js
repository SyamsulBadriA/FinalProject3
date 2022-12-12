const { checkPassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { convertToRupiah } = require('../helpers/currency');
const { User } = require('../models');

class UserController {
    static async register(req, res) {
        const { full_name, password, gender, email, } = req.body;

        await User.create({
            full_name,
            password,
            gender,
            email
        }).then(result => {
            let rupiah = convertToRupiah(result.balance);
            let response = {
                user: {
                    id: result.id,
                    full_name: result.full_name,
                    email: result.email,
                    gender: result.gender,
                    balance: rupiah,
                    createdAt: result.createdAt
                }
            }
            res.status(201).json(response);
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async login(req, res) {
        const { email,password } = req.body;

        await User.findOne({
            where: {
                email
            },
        }).then(result => {
            if(!result) {
                res.status(404).json({
                    name: "Email not Found",
                    message: "Email not found on Database"
                });
            } else {
                const isCorrect = checkPassword(password, result.password);
                if(isCorrect){
                    let payload = {
                        id: result.id,
                        email,
                        role: result.role
                    }
                    const token = generateToken(payload);
                    res.status(200).json({token});
                } else {
                    res.status(400).json({
                        name: "Invalid Password",
                        message: "Password not match with User " + email
                    });
                }
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async updateUserbyId(req, res) {
        const { full_name, email } = req.body;
        const id = res.locals.paramsId;

        let data = {
            full_name,
            email
        }

        await User.update(data, {
            where: {
                id
            },
            returning: true
        }).then(result => {
            res.status(200).json({
                user: {
                    id: result[1][0].id,
                    full_name: result[1][0].full_name,
                    email: result[1][0].email,
                    createdAt: result[1][0].createdAt,
                    updatedAt: result[1][0].updatedAt
                }
            })
        }).catch(error => {
            res.status(500).json({error});
        })
    }

    static async deleteUserbyId(req, res) {
        const id = res.locals.paramsId;

        await User.destroy({
            where: {
                id
            }
        }).then(result => {
            res.status(200).json({message: "Your Account has been Successfully deleted"});
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async topUpBalance(req, res) {
        const { balance } = req.body;
        const user = res.locals.user;

        const curBalance = user.balance;
        let newBalance = curBalance + balance;
        console.log(typeof newBalance)

        await User.update({ balance: newBalance }, {
            where: {
                id: user.id
            },
            returning: true
        }).then(result => {
            const rupiah = convertToRupiah(result[1][0].balance);
            res.status(200).json({
                message: `Your Balance has been successfully updated to ${rupiah}`
            });
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = UserController