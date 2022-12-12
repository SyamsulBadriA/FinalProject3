'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
      this.belongsTo(models.Product)
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Quantity is Required"
        },
        isNumeric: {
          args: true,
          msg: "Quantity Must be Integer or Number"
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Total Price is Required"
        },
        isNumeric: {
          args: true,
          msg: "Total Price Must be Integer or Number"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};