const { Category, Product } = require('../models');

class CategoriesControllers {
    static async createCategory(req, res) {
        const { type } = req.body;

        await Category.create({
            type
        }).then(result => {
            res.status(201).json({
                category: result
            })
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getCategories(req, res) {
        await Category.findAll({
            include: {
                model: Product,
            }
        }).then(result => {
            res.status(200).json({
                categories: result
            });
        }).catch(result => {
            res.status(500).json(error);
        })
    }

    static async patchCategory(req, res) {
        const id = req.params.categoryId;
        const { type } = req.body;

        await Category.findOne({
            where: {
                id
            },
        }).then(category => {
            if(!category) {
                res.status(404).json({
                    name: "Not Found",
                    message: `Category with id ${id} not Found on Database`
                })
            } else {
                Category.update({ type }, {
                    where: {
                        id: category.id
                    },
                    returning: true
                }).then(result => {
                    res.status(200).json({
                        category: result[1][0]
                    })
                }).catch(error => {
                    res.status(500).json(error);
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async deleteCategory(req, res) {
        const id = req.params.categoryId;

        await Category.findOne({
            where: {
                id
            },
        }).then(category => {
            if(!category) {
                res.status(404).json({
                    name: "Not Found",
                    message: `Category with id ${id} not Found on Database`
                })
            } else {
                Category.destroy({
                    where: {
                        id: category.id
                    },
                }).then(result => {
                    res.status(200).json({
                        message: "Category has been successfully deleted"
                    })
                }).catch(error => {
                    res.status(500).json(error);
                })
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = CategoriesControllers;