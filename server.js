const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const database = require('./config/database');

// --- MODELOS (Tabelas do Banco) ---
const Candidato = require('./models/Candidato');
const Empresa = require('./models/Empresa');
const Vaga = require('./models/Vaga');
const Candidatura = require('./models/Candidatura');
const Admin = require('./models/Admin'); // <--- Modelo de Admin carregado

// --- RELACIONAMENTOS (A Mágica do Sequelize) ---
// 1. Empresa tem muitas vagas
Vaga.belongsTo(Empresa, { constraint: true, foreignKey: 'empresaId' });
Empresa.hasMany(Vaga, { foreignKey: 'empresaId' });

// 2. Candidato se candidata a muitas vagas (Muitos-para-Muitos)
Candidato.belongsToMany(Vaga, { through: Candidatura });
Vaga.belongsToMany(Candidato, { through: Candidatura });

// --- ROTAS ---
const candidatoRoutes = require('./routes/candidato');
const authRoutes = require('./routes/auth');
const empresaRoutes = require('./routes/empresa');
const adminRoutes = require('./routes/admin'); // <--- NOVA ROTA IMPORTADA

// Configurações
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sessão
app.use(session({
    secret: 'segredo_vagas_js_2026',
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 3600000 }
}));

// Ligar Rotas
app.use('/', candidatoRoutes);
app.use('/', authRoutes);
app.use('/', empresaRoutes);
app.use('/', adminRoutes); // <--- ROTA DE ADMIN ATIVADA

// Rota Principal com Lógica de Redirecionamento
app.get('/', (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.tipo === 'admin') return res.redirect('/dashboard_admin');
        if (req.session.usuario.tipo === 'empresa') return res.redirect('/painel_empresa');
        if (req.session.usuario.tipo === 'candidato') return res.redirect('/mural');
    }
    res.redirect('/login');
});

// Iniciar e Sincronizar Banco de Dados
database.sync({ force: false }).then(() => {
    // Porta padrão 5004 ou a porta definida pelo ambiente (Azure/VPS)
    const PORT = process.env.PORT || 5004; 
    app.listen(PORT, () => {
        console.log(`🔥 Vagas 2.0 (W-Code) rodando na porta: ${PORT}`);
        console.log(`📦 Banco de Dados Sincronizado com suporte a Admin!`);
    });
}).catch(erro => console.error("Erro ao sincronizar banco:", erro));