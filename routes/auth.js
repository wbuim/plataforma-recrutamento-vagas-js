require('dotenv').config(); // 1. Carrega as senhas do .env

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Candidato = require('../models/Candidato');
const Empresa = require('../models/Empresa');
const Admin = require('../models/Admin');

// Configuração E-mail (W-Code Dev) - VIA DOTENV
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // Lê do arquivo oculto
        pass: process.env.EMAIL_PASS  // Lê do arquivo oculto
    }
});

// 1. Tela de Login
router.get('/login', (req, res) => {
    res.render('login');
});

// 2. Fazer Login
router.post('/logar', async (req, res) => {
    const { email, senha, tipoUsuario } = req.body;
    
    let usuario = null;
    let tipo = '';

    try {
        if (tipoUsuario === 'admin') {
            usuario = await Admin.findOne({ where: { email: email } });
            tipo = 'admin';
        } else if (tipoUsuario === 'empresa') {
            usuario = await Empresa.findOne({ where: { email: email } });
            tipo = 'empresa';
        } else {
            usuario = await Candidato.findOne({ where: { email: email } });
            tipo = 'candidato';
        }

        if (!usuario) {
            return res.render('login', { erro: `Não encontramos uma conta de ${tipo} com este e-mail.` });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.render('login', { erro: 'Senha incorreta.' });
        }

        req.session.usuario = { id: usuario.id, nome: usuario.nome, tipo: tipo };

        if (tipo === 'admin') res.redirect('/dashboard_admin');
        else if (tipo === 'empresa') res.redirect('/painel_empresa');
        else res.redirect('/mural');

    } catch (error) {
        console.error("Erro no login:", error);
        res.render('login', { erro: 'Ocorreu um erro interno no servidor.' });
    }
});

// 3. Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- RECUPERAÇÃO DE SENHA ---
router.get('/esqueci_senha', (req, res) => {
    res.render('esqueci_senha');
});

router.post('/enviar_recuperacao', async (req, res) => {
    const { email } = req.body;
    
    let userC = await Candidato.findOne({ where: { email: email } });
    let userE = await Empresa.findOne({ where: { email: email } });
    let userA = await Admin.findOne({ where: { email: email } });

    if (!userC && !userE && !userA) {
        return res.render('esqueci_senha', { erro: 'E-mail não encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const agora = new Date();
    agora.setHours(agora.getHours() + 1);

    if (userC) await Candidato.update({ resetToken: token, resetExpires: agora }, { where: { id: userC.id } });
    if (userE) await Empresa.update({ resetToken: token, resetExpires: agora }, { where: { id: userE.id } });
    if (userA) await Admin.update({ resetToken: token, resetExpires: agora }, { where: { id: userA.id } });

    const link = `https://vagas.wcode.dev.br/resetar_senha/${token}`;
    
    const mailOptions = {
        from: 'W-Code Vagas <noreply@wcode.com>',
        to: email,
        subject: 'Redefinição de Senha',
        text: `Link para resetar senha: ${link}`
    };

    transporter.sendMail(mailOptions, (err) => {
        if(err) console.error("Erro ao enviar email:", err);
    });
    res.send("<h1>Verifique seu e-mail! 📧</h1><a href='/login'>Voltar</a>");
});

module.exports = router;