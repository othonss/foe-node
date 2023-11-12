const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Task = db.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Task.belongsTo(User);
User.hasMany(Task);

module.exports = Task;
