const { convertToRupiah } = require('../helpers/currency');
const { TransactionHistory, Product, User, Category } = require('../models');

class TransactionController {
    static async makeTransaction(req, res) {
        const { productId, quantity } = req.body;
        const user = res.locals.user;

        await Product.findOne({
            where: {
                id: productId
            }
        }).then(product => {
            if(!product) {
                res.status(404).json({
                    name: "Not Found",
                    message: `Product with id ${productId} is not Found on Database`
                })
            } else {
                let remainStock = product.stock - quantity;
                if(remainStock < 5) {
                    res.status(400).json({
                        name: "Out of Stock",
                        message: "Quantity more than Minimum Stock"
                    })
                } else {
                    let curBalance = user.balance;
                    let totalPrice = product.price * quantity;
                    let remainBalance = curBalance - totalPrice;
                    if(remainBalance >= 0) {
                        // Update Stock
                        Product.update({stock: remainStock}, {
                            where: {
                                id: product.id
                            }
                        }).catch(error => {
                            res.status(500).json(error);
                        })

                        // Update User's Balance
                        User.update({balance: remainBalance}, {
                            where: {
                                id: user.id
                            }
                        }).catch(error => {
                            res.status(500).json(error);
                        })

                        //Update Sold Product Amount
                        Category.findOne({
                            where: {
                                id: product.CategoryId
                            }
                        }).then(category => {
                            let curSold = category.sold_product_amount;
                            let newSold = curSold + quantity;

                            Category.update({sold_product_amount: newSold}, {
                                where: {
                                    id: category.id
                                }
                            }).catch(error => {
                                res.status(error).json(error);
                            })
                        }).catch(error => {
                            res.status(500).json(error);
                        })

                        // Create Transaction History
                        TransactionHistory.create({
                            ProductId: product.id,
                            UserId: user.id,
                            quantity,
                            total_price: totalPrice
                        }).then(result => {
                            let bill = result;
                            res.status(201).json({
                                message: "You have successfully purchase the product",
                                transactionBill: {
                                    total_price: convertToRupiah(bill.total_price),
                                    quantity,
                                    product_name: product.title
                                }
                            })
                        }).catch(error => {
                            res.status(500).json(error);
                        })
                    } else {
                        res.status(402).json({
                            name: "Payment Failed",
                            message: "Your Balance is Not Enough to Make a Transaction, Please Topup to Continue your Transaction",
                            bill: {
                                "Your Balance": convertToRupiah(user.balance),
                                "Your Bill": convertToRupiah(totalPrice)
                            }
                        })
                    }
                }
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getTransactionHistoryUser(req, res) {
        const UserId = res.locals.user.id;

        TransactionHistory.findAll({
            where: {
                UserId
            },
            attributes: [
                'ProductId', 'UserId', 'quantity', 
                'total_price', 'createdAt', 'updatedAt'
            ],
            include: {
                model: Product,
                attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
            }
        }).then(result => {
            let data = result;
            for (let i = 0; i < data.length; i++) {
                let totalPrice = data[i].total_price;
                let productPrice = data[i].Product.price;
                
                totalPrice = convertToRupiah(totalPrice);
                productPrice = convertToRupiah(productPrice);

                data[i].total_price = totalPrice;
                data[i].Product.price = productPrice;
            }
            res.status(200).json({transactionHistories: data})
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getTransactionHistoryAdmin(req, res) {
        TransactionHistory.findAll({
            attributes: [
                'ProductId', 'UserId', 'quantity', 
                'total_price', 'createdAt', 'updatedAt'
            ],
            include: [{
                model: Product,
                attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
            }, {
                model: User,
                attributes: ['id', 'email', 'balance', 'gender', 'role']
            }]
        }).then(result => {
            let data = result;
            for (let i = 0; i < data.length; i++) {
                let totalPrice = data[i].total_price;
                let productPrice = data[i].Product.price;
                
                totalPrice = convertToRupiah(totalPrice);
                productPrice = convertToRupiah(productPrice);

                data[i].total_price = totalPrice;
                data[i].Product.price = productPrice;
            }
            res.status(200).json({transactionHistories: data})
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getTransactionHistorybyId(req, res) {
        const transactionId = +req.params.transactionId;

        await User.findOne({
            where: {
                id: res.locals.user.id
            },
            include: {
                model: TransactionHistory,
                attributes: [
                    'ProductId', 'UserId', 'quantity',
                    'total_price', 'createdAt', 'updatedAt'
                ],
            }
        }).then(user => {
            if(user.TransactionHistories.length === 0) {
                res.status(404).json({
                    name: "Not Found",
                    message: "No Transactions Found on This Account"
                })
            } else {
                TransactionHistory.findOne({
                    where: {
                        id: transactionId
                    },
                    include: {
                        model: Product,
                        attributes: [
                            'id', 'title', 'price', 'stock', 'CategoryId'
                        ]
                    }
                }).then(result => {
                    if(!result) {
                        res.status(404).json({
                            name: "Not Found",
                            message: `Transaction with id ${transactionId} Not Found`
                        })
                    } else {
                        if(result.UserId === user.id) {
                            let response = result;
                            delete response.dataValues.id;

                            res.status(200).json(response);
                        } else {
                            res.status(403).json({
                                name: "Unauthorized",
                                message: `Transaction with id ${transactionId} not Belong to You`
                            })
                        }
                    }
                }).catch(error => {
                    res.status(500).json(error);
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = TransactionController;