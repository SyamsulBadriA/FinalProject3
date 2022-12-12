'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TransactionHistory)
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Full Name Is Required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email has been Registered"
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Valid Email is Required"
        },
        notEmpty: {
          args: true,
          msg: 'Email Is Required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password Is Required'
        },
        len: {
          args: [6, 10],
          msg: "Password Must be 6 - 10 Characters"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Gender Is Required'
        },
        isIn: {
          args: [['male', 'female']],
          msg: "Must be male or female"
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role Is Required'
        },
        isIn: {
          args: [[0, 1]],
          msg: "Only Allowed 0 or 1"
        }
      },
    },
    balance: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          args: true,
          msg: "Numeric Type is Required"
        },
        notEmpty: {
          args: true,
          msg: 'Balance Is Required'
        },
        min: {
          args: [0],
          msg: "Minimum Balance is Rp 0,00"
        },
        max: {
          args: [100000000],
          msg: "Maximum Balance is Rp 100.000.000,00"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        let inputPassword = user.password;
        const hashedPassword = hashPassword(inputPassword);
        user.password = hashedPassword;
        user.role = 1;
        user.balance = 0;
      },
      beforeBulkCreate: (user, options) => {
        let inputPassword = user.password;
        const hashedPassword = hashPassword(inputPassword);
        user.password = hashedPassword;
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};