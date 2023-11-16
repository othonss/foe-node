const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Task = db.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  done:{
    type: DataTypes.BOOLEAN,
    require: true 
 }
});

Task.belongsTo(User, {
  onDelete: 'CASCADE', // Remove as tarefas associadas quando o usuário é excluído
});
User.hasMany(Task, {
  onDelete: 'CASCADE', // Remove as tarefas associadas quando o usuário é excluído
});

module.exports = Task;
