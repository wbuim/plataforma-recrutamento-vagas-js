const express = require('express');
const router = express.Router();
const Empresa = require('../models/Empresa');
const Vaga = require('../models/Vaga');
const Candidato = require('../models/Candidato');
const bcrypt = require('bcrypt');

// 1. Tela de Cadastro
router.get('/cadastro_empresa', (req, res) => {
    res.render('cadastro_empresa');
});

// 2. Salvar Empresa
router.post('/salvar_empresa', async (req, res) => {
    const { nome, cnpj, endereco, email, senha } = req.body;

    if (!req.body.termoAceito) return res.redirect('/cadastro_empresa?erro=termo');

    const existe = await Empresa.findOne({ where: { email: email } });
    if (existe) return res.render('cadastro_empresa', { erro: 'E-mail já cadastrado.' });

    const salt = await bcrypt.genSalt(10);
    const senhaSegura = await bcrypt.hash(senha, salt);

    try {
        const novaEmpresa = await Empresa.create({ nome, cnpj, endereco, email, senha: senhaSegura, termoAceito: true, termoAceitoEm: new Date() });
        req.session.usuario = { id: novaEmpresa.id, nome: novaEmpresa.nome, tipo: 'empresa' };
        res.redirect('/painel_empresa');
    } catch (erro) {
        res.render('cadastro_empresa', { erro: 'Erro ao cadastrar.' });
    }
});

// 3. Painel da Empresa
router.get('/painel_empresa', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'empresa') return res.redirect('/login');

    const vagas = await Vaga.findAll({ 
        where: { empresaId: req.session.usuario.id },
        include: [{ model: Candidato }],
        order: [['createdAt', 'DESC']]
    });

    res.render('painel_empresa', { usuario: req.session.usuario, vagas });
});

// 4. Publicar Vaga
router.post('/salvar_vaga', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'empresa') return res.redirect('/login');
    const { titulo, salario, descricao, requisitos } = req.body;
    
    await Vaga.create({
        titulo, salario, descricao, requisitos,
        empresaId: req.session.usuario.id
    });
    res.redirect('/painel_empresa');
});

// 5. Marcar Vaga como Preenchida
router.post('/vaga/:id/preencher', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'empresa') return res.redirect('/login');

    const vaga = await Vaga.findOne({ where: { id: req.params.id, empresaId: req.session.usuario.id } });
    if (!vaga) return res.redirect('/painel_empresa');

    await vaga.update({ preenchida: true, preenchidaEm: new Date() });
    res.redirect('/painel_empresa');
});

// 6. Excluir Vaga (somente se preenchida)
router.post('/vaga/:id/excluir', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'empresa') return res.redirect('/login');

    const vaga = await Vaga.findOne({ where: { id: req.params.id, empresaId: req.session.usuario.id } });
    if (!vaga) return res.redirect('/painel_empresa');
    if (!vaga.preenchida) return res.redirect('/painel_empresa?erro=nao_preenchida');

    await vaga.destroy();
    res.redirect('/painel_empresa');
});

// 7. Ver Currículos
router.get('/vaga/:id/candidatos', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'empresa') return res.redirect('/login');

    const vaga = await Vaga.findOne({
        where: { id: req.params.id, empresaId: req.session.usuario.id },
        include: [{ model: Candidato }]
    });

    if (!vaga) return res.redirect('/painel_empresa');
    res.render('lista_candidatos', { vaga: vaga });
});

module.exports = router;