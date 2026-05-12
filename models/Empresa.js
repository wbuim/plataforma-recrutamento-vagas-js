const Sequelize = require('sequelize');
const database = require('../config/database');

const Empresa = database.define('empresa', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    senha: { type: Sequelize.STRING, allowNull: false },
    cnpj: { type: Sequelize.STRING, unique: true },
    endereco: Sequelize.STRING,

    // --- LGPD ---
    termoAceito: { type: Sequelize.BOOLEAN, defaultValue: false },
    termoAceitoEm: { type: Sequelize.DATE, allowNull: true }
});

module.exports = Empresa;
