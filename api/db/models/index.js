// Loads then combines models for easier importing in other files

const { Category } = require('./category.model');
const { Task } = require('./task.model');
const { User } = require('./user.model');
const { Config } = require('./config.model');

module.exports = { Category, Task, User, Config } 