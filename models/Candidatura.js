const Sequelize = require('sequelize');
const database = require('../config/database');

// Tabela simples que liga o ID do Candidato ao ID da Vaga
const Candidatura = database.define('candidatura', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // Vamos guardar a data que ele se candidatou automaticamente (createdAt)
});

module.exports = Candidatura;
