const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Candidato = require('../models/Candidato');
const Vaga = require('../models/Vaga');
const Empresa = require('../models/Empresa');
const Candidatura = require('../models/Candidatura');

// 1. Tela de Cadastro
router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// 2. Salvar Candidato
router.post('/salvar_candidato', async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!req.body.termoAceito) return res.redirect('/cadastro?erro=termo');

    const existe = await Candidato.findOne({ where: { email: email } });
    if (existe) return res.render('cadastro', { erro: 'E-mail já cadastrado!' });

    const salt = await bcrypt.genSalt(10);
    const senhaSegura = await bcrypt.hash(senha, salt);

    try {
        const novoCandidato = await Candidato.create({ nome, email, cpf, senha: senhaSegura, termoAceito: true, termoAceitoEm: new Date() });
        req.session.usuario = { id: novoCandidato.id, nome: novoCandidato.nome, tipo: 'candidato' };
        res.redirect('/meu_curriculo');
    } catch (erro) {
        console.log(erro);
        res.render('cadastro', { erro: 'Erro ao cadastrar.' });
    }
});

// 3. Mural de Vagas
router.get('/mural', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'candidato') return res.redirect('/login');

    const vagas = await Vaga.findAll({
        where: { preenchida: false },
        include: [{ model: Empresa }],
        order: [['createdAt', 'DESC']]
    });

    const candidaturas = await Candidatura.findAll({
        where: { candidatoId: req.session.usuario.id },
        attributes: ['vagaId']
    });
    const idsCandidatados = candidaturas.map(c => c.vagaId);

    res.render('mural', { usuario: req.session.usuario, vagas, idsCandidatados });
});

// 4. Candidatar-se
router.get('/candidatar/:idVaga', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'candidato') return res.redirect('/login');
    
    try {
        const jaExiste = await Candidatura.findOne({ 
            where: { candidatoId: req.session.usuario.id, vagaId: req.params.idVaga } 
        });

        if (!jaExiste) {
            await Candidatura.create({ candidatoId: req.session.usuario.id, vagaId: req.params.idVaga });
        }
        res.redirect('/mural');
    } catch (erro) {
        res.redirect('/mural');
    }
});

// 5. Editar Currículo
router.get('/meu_curriculo', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'candidato') return res.redirect('/login');
    const candidato = await Candidato.findByPk(req.session.usuario.id);
    res.render('curriculo', { candidato });
});

// 6. Salvar Currículo
router.post('/salvar_curriculo', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'candidato') return res.redirect('/login');
    const { telefone, nascimento, resumo, formacaoJSON, experienciaJSON, habilidades } = req.body;
    
    let arrayHabilidades = [];
    if (habilidades) arrayHabilidades = Array.isArray(habilidades) ? habilidades : [habilidades];
    const habilidadesString = JSON.stringify(arrayHabilidades);

    await Candidato.update(
        { telefone, nascimento, resumo, formacao: formacaoJSON, experiencia: experienciaJSON, habilidades: habilidadesString },
        { where: { id: req.session.usuario.id } }
    );
    res.send("<script>alert('Currículo atualizado!'); window.location.href='/mural';</script>");
});

module.exports = router;