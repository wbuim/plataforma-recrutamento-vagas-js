const express = require('express');
const router = express.Router();
const Candidato = require('../models/Candidato');
const Empresa = require('../models/Empresa');
const Vaga = require('../models/Vaga');
const Candidatura = require('../models/Candidatura');

// Middleware de proteção
function isAdmin(req, res, next) {
    if (req.session.usuario && req.session.usuario.tipo === 'admin') return next();
    res.redirect('/login');
}

// Dashboard Principal com listagem completa
router.get('/dashboard_admin', isAdmin, async (req, res) => {
    try {
        const stats = {
            totalCandidatos: await Candidato.count(),
            totalEmpresas: await Empresa.count(),
            totalVagas: await Vaga.count(),
            totalCandidaturas: await Candidatura.count()
        };
        const todasVagas = await Vaga.findAll({ include: [{ model: Empresa }], order: [['createdAt', 'DESC']] });
        const todasEmpresas = await Empresa.findAll();
        const vagasPreenchidas = await Vaga.findAll({
            where: { preenchida: true },
            include: [{ model: Empresa }],
            order: [['preenchidaEm', 'DESC']]
        });

        res.render('admin/dashboard', { usuario: req.session.usuario, stats, todasVagas, todasEmpresas, vagasPreenchidas });
    } catch (error) {
        res.status(500).send("Erro ao carregar o painel administrativo.");
    }
});

// Detalhes da Vaga e Candidatos
router.get('/admin/vaga/:id', isAdmin, async (req, res) => {
    try {
        const vaga = await Vaga.findByPk(req.params.id, {
            include: [{ model: Empresa }, { model: Candidato }]
        });
        if (!vaga) return res.redirect('/dashboard_admin');
        res.render('admin/detalhes_vaga', { vaga });
    } catch (error) {
        res.redirect('/dashboard_admin');
    }
});

// Relatório Completo de Candidatos
router.get('/admin/exportar/candidatos_full', isAdmin, async (req, res) => {
    const candidatos = await Candidato.findAll();
    let csv = '\ufeffNome;Email;CPF;Telefone;Nascimento;Resumo\n';
    candidatos.forEach(c => {
        csv += `${c.nome};${c.email};${c.cpf || ''};${c.telefone || ''};${c.nascimento || ''};"${(c.resumo || '').replace(/\n/g, ' ')}"\n`;
    });
    res.setHeader('Content-disposition', 'attachment; filename=relatorio_candidatos_wcode.csv');
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.send(csv);
});

// Relatório Completo de Empresas
router.get('/admin/exportar/empresas_full', isAdmin, async (req, res) => {
    const empresas = await Empresa.findAll({ include: [Vaga] });
    let csv = '\ufeffEmpresa;CNPJ;Email;Endereco;Vagas_Ativas\n';
    empresas.forEach(e => {
        csv += `${e.nome};${e.cnpj || ''};${e.email};"${e.endereco || ''}";${e.vagas.length}\n`;
    });
    res.setHeader('Content-disposition', 'attachment; filename=relatorio_empresas_wcode.csv');
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.send(csv);
});

module.exports = router;