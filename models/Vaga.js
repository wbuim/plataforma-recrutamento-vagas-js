const Sequelize = require('sequelize');
const database = require('../config/database');
const Empresa = require('./Empresa'); // Importa para fazer a ligação

const Vaga = database.define('vaga', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    titulo: { type: Sequelize.STRING, allowNull: false },
    descricao: Sequelize.TEXT,
    salario: Sequelize.STRING,
    requisitos: Sequelize.TEXT,
    ativa: { type: Sequelize.BOOLEAN, defaultValue: true },
    preenchida: { type: Sequelize.BOOLEAN, defaultValue: false },
    preenchidaEm: { type: Sequelize.DATE, allowNull: true }
});

// CRIA O RELACIONAMENTO: Uma Vaga pertence a uma Empresa
Vaga.belongsTo(Empresa, { constraint: true, foreignKey: 'empresaId' });
Empresa.hasMany(Vaga, { foreignKey: 'empresaId' });

module.exports = Vaga;

