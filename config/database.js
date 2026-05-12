const Sequelize = require('sequelize');
const path = require('path');

// O Azure cria essa variável automaticamente. Se ela existir, estamos na nuvem.
const isAzure = !!process.env.WEBSITE_SITE_NAME;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // LÓGICA DO CAMINHO:
    // 1. Se for Azure: Usa o caminho absoluto padrão (/home/site/wwwroot/...)
    // 2. Se for PC Local: Usa o seu caminho relativo original (../...)
    storage: isAzure 
        ? path.resolve('/home/site/wwwroot/banco_vagas.sqlite') 
        : path.join(__dirname, '../banco_vagas.sqlite'),
    logging: false
});

module.exports = sequelize;