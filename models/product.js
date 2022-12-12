'use strict';
const {
  Model
} = require('sequelize');
const { convertToRupiah } = require('../helpers/currency');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category)
      this.hasMany(models.TransactionHistory)
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title is Required"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Price is Required"
        },
        isNumeric: {
          args: true,
          msg: "Stock Must be Number or Integer"
        },
        min: {
          args: 5,
          msg: "Minimum Price is 0"
        },
        max: {
          args: 50000000,
          msg: "Maximum Price is 50000000"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Stock is Required"
        },
        isNumeric: {
          args: true,
          msg: "Stock Must be Number or Integer"
        },
        min: {
          args: 5,
          msg: "Minimum Stocks in Products is 5"
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      afterCreate(product, options) {
        let newPrice = product.price;
        product.price = convertToRupiah(newPrice);
      },
    },
    sequelize,
    modelName: 'Product',
  });
  return Product;
};