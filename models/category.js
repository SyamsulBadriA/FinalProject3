'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product)
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Type is Required"
        },
      },
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Sold Product Amount is Required"
        },
        isNumeric: {
          args: true,
          msg: "Sold Product Amount Must be Integer or Number"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate(category, options) {
        category.sold_product_amount = 0;
      }
    },
    sequelize,
    modelName: 'Category',
  });
  return Category;
};