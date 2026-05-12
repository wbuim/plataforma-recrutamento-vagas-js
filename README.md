# 💼 Vagas-JS | Plataforma de Empregos

> Sistema completo de recrutamento (Marketplace de Vagas) conectando empresas e candidatos. Permite cadastro de currículos dinâmicos, publicação de vagas e gestão de candidaturas.

![Mural de Vagas](screenshots/mural.png)

## 🚀 Funcionalidades

### 🏢 Para Empresas
- **Gestão de Vagas:** Publicação e gerenciamento de oportunidades.
- **Triagem:** Visualização dos candidatos interessados em cada vaga.
- **Acesso ao Talento:** Visualização detalhada do currículo e contato direto.

### 👤 Para Candidatos
- **Currículo Dinâmico:** Adição ilimitada de formações e experiências profissionais.
- **Mural de Oportunidades:** Visualização e candidatura rápida em vagas.
- **Status:** Feedback visual de vagas onde já se candidatou.

## 📸 Telas do Sistema

| Acesso ao Sistema | Painel da Empresa |
|:---:|:---:|
| ![Login](screenshots/login.png) | ![Painel Empresa](screenshots/painel_empresa.png) |

| Edição de Currículo | Detalhes da Vaga |
|:---:|:---:|
| ![Currículo](screenshots/curriculo.png) | *Visualização responsiva e intuitiva* |

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Frontend:** EJS, CSS Moderno
- **Banco de Dados:** SQLite (Sequelize ORM)
- **Segurança:** Bcrypt (Hash de senhas) e Sessões
- **Extras:** Nodemailer (Recuperação de senha via e-mail)

## 📦 Como Rodar o Projeto

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/wbuim/vagas-js.git
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure o E-mail (Opcional):
   - Edite `routes/auth.js` para configurar o envio de recuperação de senha.

4. Inicie o servidor:
\`\`\`bash
npm start
\`\`\`

5. Acesse: `http://localhost:5004`

## 👤 Autor

**Wanderley Muzati**
* Desenvolvedor Fullstack