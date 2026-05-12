const Sequelize = require('sequelize');
const database = require('../config/database');

const Candidato = database.define('candidato', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    senha: { type: Sequelize.STRING, allowNull: false },
    cpf: { type: Sequelize.STRING, unique: true },
    
    // --- CAMPOS DO CURRÍCULO ---
    telefone: Sequelize.STRING,
    nascimento: Sequelize.STRING,
    resumo: Sequelize.TEXT,
    
    // JSONs
    formacao: Sequelize.TEXT,    
    experiencia: Sequelize.TEXT, 
    habilidades: Sequelize.TEXT, // <--- CONFIRA SE TEM ESSA VÍRGULA AQUI!

    // --- RECUPERAÇÃO DE SENHA ---
    resetToken: Sequelize.STRING,
    resetExpires: Sequelize.DATE,

    // --- LGPD ---
    termoAceito: { type: Sequelize.BOOLEAN, defaultValue: false },
    termoAceitoEm: { type: Sequelize.DATE, allowNull: true }
});

module.exports = Candidato;