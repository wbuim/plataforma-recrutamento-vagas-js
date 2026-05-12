const Sequelize = require('sequelize');
const database = require('../config/database');

const Admin = database.define('admin', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    senha: { type: Sequelize.STRING, allowNull: false }
});

module.exports = Admin;