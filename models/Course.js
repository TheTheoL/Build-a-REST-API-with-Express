'use strict';
const { Model, DataTypes } = require('sequelize');
const user = require('./user');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    }
  }, {sequelize});

Course.associate = (models) => {
    Course.belongsTo(models.User, {
        as: 'student',
        foreignKey: {
            fieldName: 'studentUserId',
            allowNull: false,
        }
    });
}

  return Course;
}