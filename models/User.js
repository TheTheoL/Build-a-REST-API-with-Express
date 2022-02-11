'use strict';
const bcrypt = require('bcryptjs');

const {
  Model,
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A first name is required'
          },
          notEmpty: {
            msg: 'Please provide a first name'
          }
        }
      },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required'
          },
          notEmpty: {
            msg: 'Please provide a last name'
          }
        }
      },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          },
          len: {
            args: [8, 20],
            msg: 'The password should be between 8 and 20 characters in length'
          },
          set(val) {
            if(val === this.password) {
                const hashedPassword = bcrypt.hashSync(this.password, 8);
                this.setDataValue('password', hashedPassword);
            }
        }
        }
      },
      

  }, {sequelize});

  User.associate = (models) => {
      User.hasMany(models.Course, {
        as: 'student',
        foreignKey: {
            fieldName: 'userId',
            allowNull: false
        }
      });
  }
  
  return User;
}