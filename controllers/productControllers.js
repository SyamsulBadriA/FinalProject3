const { convertToRupiah } = require('../helpers/currency');
const { Product, Category } = require('../models');

class ProductControllers {
    static async getProducts(req, res) {
        await Product.findAll({
        }).then(products => {
            res.status(200).json({
                products
            })
        })
    }
    
    static async createProduct(req, res) {
        const { title, price, stock, CategoryId } = req.body;

        await Category.findOne({
            where: {
                id: CategoryId
            }
        }).then(result => {
            if(result) {
                Product.create({
                    title,
                    price,
                    stock,
                    CategoryId
                }).then(newProduct => {
                    res.status(201).json({
                        product: newProduct
                    })
                }).catch(error => {
                        res.status(500).json(error);
                })
            } else {
                res.status(404).json({
                    name: "Not Found",
                    message: `Category with id ${CategoryId} not found in Database`
                })
            }
        }).catch(error => {
            res.status(500).json(error)
        })
    }

    static async updateProductbyId(req, res) {
        const id = req.params.productId;
        const { price, stock, title } = req.body;

        await Product.update({price, stock, title}, {
            where: {
                id
            },
            returning: true,
        }).then(result => {
            if(result[0]) {
                let product = result[1][0];
                let newPrice = convertToRupiah(product.price);
                product.price = newPrice;
                res.status(200).json({product});
            } else {
                res.status(404).json({
                    name: "Not Found",
                    message: `Product with id ${id} not found on Database`
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async patchCategoryProduct(req, res) {
        const id = req.params.productId;
        const { CategoryId } = req.body;

        await Category.findOne({
            where: {
                id: CategoryId
            }
        }).then(found => {
            if(found){
                Product.update({CategoryId}, {
                    where: {
                        id
                    },
                    returning: true
                }).then(result => {
                    if(result[0]) {
                        let product = result[1][0];
                        let newPrice = convertToRupiah(product.price);
                        product.price = newPrice;
                        res.status(200).json({product});
                    } else {
                        res.status(404).json({
                            name: "Not Found",
                            message: `Product with id ${id} not found on Database`
                        })
                    }
                }).catch(error => {
                    res.status(500).json(error);
                })
            } else {
                res.status(404).json({
                    name: "Not Found",
                    message: `Category with id ${CategoryId} not found on Database` 
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async deleteProductById(req, res) {
        const id = req.params.productId;

        await Product.destroy({
            where: {
                id
            }
        }).then(result => {
            if(result) {
                res.status(200).json({
                    message: "Product has been successfully deleted"
                })
            } else {
                res.status(404).json({
                    name: "Not Found",
                    message: `Product with id ${id} not found on Database` 
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = ProductControllers;