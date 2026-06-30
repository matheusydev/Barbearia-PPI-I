<div align="center">

# 💈 Barbearia Barba Negra

Sistema full-stack para gerenciamento de uma barbearia, desenvolvido em grupo como trabalho da disciplina **Programação para Internet I**. Inclui uma API REST (Node.js + Express + MongoDB) e um front-end completo (HTML, CSS vaScript puro) para cadastro de barbeiros e agendamentos de clientes, em uma relação mestre-detalhe.

🔗 **Hospedagem:** https://barbearia-ppi-i.onrender.com

🎥 **Vídeo de apresentação:** https://youtu.be/eXhzTakArdc

<br/>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

</div>

---

## 📝 Descrição do Projeto

O projeto consiste em um sistema completo para gestão de uma barbearia, dividido em duas camadas:

- **Back-end:** uma API REST construída com Node.js e Express, persistindo dados em MongoDB através do Mongoose. Expõe rotas completas (GET, POST, PUT, PATCH, DELETE) para as entidades `Barbeiro` e `Agendamento`, com validações de regras de negócio no servidor e ordenação definida para as listagens.
- **Front-end:** uma aplicação multi-página em HTML, CSS e JavaScript puro (sem frameworks), que consome essa API via `fetch`. Cobre o CRUD completo das duas entidades, com validação client-side, ordenação configurável, cache offline em `localStorage` e alternância entre tema claro e escuro.

O sistema permite cadastrar barbeiros, controlar quais estão ativos, e gerenciar os agendamentos dos clientes — incluindo a escolha de serviço, data/hora e barbeiro responsável — impedindo conflitos de horário para o mesmo profissional.

---

## 🏗️ O que foi desenvolvido

### Back-end (API REST)

- Modelagem das entidades `Barbeiro` e `Agendamento` com Mongoose, em relação 1:N
- Rotas REST completas (GET, POST, PUT, PATCH, DELETE) para as duas entidades
- Validação de campos obrigatórios no servidor, com mensagens de erro específicas por campo (via `required` do Mongoose)
- Regra de negócio server-side: impedir que um barbeiro tenha dois agendamentos com status `Agendado` no mesmo horário (na criação e na edição)
- Rota dedicada para listar agendamentos por barbeiro (`/api/agendamentos/barbeiro/:barbeiroId`)
- `populate` do Mongoose para retornar os dados do barbeiro (nome e especialidade) junto do agendamento
- Ordenação definida no servidor: barbeiros por `nome`, agendamentos por `dataHora`
- Configuração de variáveis de ambiente com `dotenv` e middleware `cors`
- Servidor Express também serve os arquivos estáticos do front-end (`express.static`), unificando back-end e front-end em uma única aplicação

### Front-end (HTML, CSS e JavaScript)

- Três páginas: `index.html` (redireciona para a listagem de barbeiros), `barbeiros.html` e `agendamentos.html`, com navegação compartilhada entre elas
- Camada de acesso à API isolada em `js/api.js`, centralizando todas as chamadas `fetch` e o tratamento padronizado de erros (`{ erro: 'mensagem' }`)
- CRUD completo de barbeiros e de agendamentos direto na interface: cadastrar, editar, listar, inativar/ativar (barbeiro), concluir/cancelar (agendamento) e excluir
- Validação client-side dos campos obrigatórios antes do envio, com mensagens de erro por campo e marcação visual do input inválido
- Select de barbeiros no formulário de agendamento populado dinamicamente pela API, exibindo apenas barbeiros ativos
- Conversão entre o formato `datetime-local` do navegador e o ISO 8601 esperado pela API
- Ordenação client-side configurável (por nome, especialidade, data/hora, status ou cliente), com a preferência de cada página persistida no `localStorage`
- Cache offline: a última listagem obtida da API é salva no `localStorage` e usada como fallback (com aviso visível) caso o servidor fique indisponível
- Alternância de tema claro/escuro com persistência no `localStorage`, aplicada antes da renderização do restante da página para evitar "flash" do tema errado
- Escape de HTML (`escaparHtml`) em todo conteúdo dinâmico renderizado nas tabelas, prevenindo injeção de HTML/XSS a partir dos dados cadastrados
- Layout responsivo construído apenas com CSS (Flexbox), usando variáveis CSS (`:root` / `[data-tema="dark"]`) para os dois temas

---

## ⚡ Principais Desafios Encontrados

- **Conflito de horário entre agendamentos** — implementar a regra de negócio que impede dois agendamentos `Agendado` para o mesmo barbeiro no mesmo horário, validando tanto na criação (`POST`) quanto na edição (`PUT`, excluindo o próprio registro da verificação)
- **Relacionamento entre entidades no Mongoose** — usar `ObjectId` com `ref` no schema de `Agendamento` e `populate()` para trazer os dados do barbeiro junto da listagem
- **Definir PUT vs PATCH** — separar o que é atualização completa (`PUT`) do que é atualização parcial de um único campo, como o `status` do agendamento ou o `ativo` do barbeiro
- **Ordenação no servidor vs. no cliente** — decidir o critério padrão de ordenação no back-end (nome para barbeiros, data/hora para agendamentos) e, no front-end, permitir que o usuário reordene a listagem sem precisar de uma nova requisição
- **Conversão de datas entre front-end e back-end** — compatibilizar o valor de `<input type="datetime-local">` (sem fuso) com o formato ISO 8601 esperado pela API, sem perder a hora exibida ao reabrir um agendamento para edição
- **Tema sem "flash" inicial** — aplicar o tema salvo no `localStorage` antes do carregamento completo da página, para evitar que o usuário veja o tema claro por um instante antes de o escuro ser aplicado
- **Resiliência a falhas de conexão** — implementar um cache local que mantém a última listagem visível (com aviso) quando a API está fora do ar, sem quebrar a experiência do usuário
- **Sincronizar o select de barbeiros com o cadastro** — manter a lista de barbeiros do formulário de agendamento sempre atualizada e restrita a barbeiros ativos, sem perder a seleção atual ao recarregar

---

## 📋 Entidades do Sistema

- **Barbeiro** *(mestre)* — nome, especialidade, telefone e status ativo/inativo
- **Agendamento** *(detalhe)* — dados do cliente, serviço escolhido (`Corte`, `Barba`, `Corte + Barba`, `Hidratação` ou `Relaxamento`), data/hora, status (`Agendado`, `Concluído` ou `Cancelado`) e referência ao barbeiro

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica das três páginas do front-end |
| CSS3 | Estilização, layout responsivo e temas claro/escuro via variáveis CSS |
| JavaScript (Vanilla) | Manipulação do DOM, consumo da API via `fetch`, validações e `localStorage` |
| Node.js | Ambiente de execução do servidor |
| Express 5 | Criação das rotas e middleware da API REST, e servidor de arquivos estáticos |
| MongoDB | Banco de dados NoSQL para persistência |
| Mongoose | Modelagem de schemas e validações |
| CORS | Liberação de requisições do front-end |
| dotenv | Variáveis de ambiente |
| Nodemon | Reinício automático em desenvolvimento |

---

## ✨ Funcionalidades

### API (back-end)

- CRUD completo de barbeiros (criar, listar, buscar por ID, atualizar, ativar/inativar, remover)
- CRUD completo de agendamentos (criar, listar, buscar por ID, atualizar, alterar status, remover)
- Listagem de agendamentos filtrada por barbeiro
- Validação de campos obrigatórios no servidor
- Bloqueio de agendamentos conflitantes para o mesmo barbeiro e horário
- Ordenação automática das listagens no servidor

### Interface (front-end)

- Cadastro, edição, listagem e remoção de barbeiros e de agendamentos pela interface
- Ativação/inativação de barbeiros e atalhos para concluir/cancelar agendamentos diretamente na tabela
- Validação dos formulários no navegador, com mensagens de erro por campo
- Ordenação das tabelas por diferentes critérios, lembrada entre visitas
- Modo offline com aviso visível, exibindo os últimos dados salvos no `localStorage` quando a API não responde
- Alternância de tema claro/escuro, com a preferência salva entre páginas e recarregamentos
- Navegação simples entre as páginas de Barbeiros e Agendamentos

---

## 📁 Estrutura de Pastas

```bash
Barbearia-PPI-I/
├── server.js                   # ponto de entrada da aplicação
├── package.json
├── .env                         # variáveis de ambiente (não versionado)
├── src/
│   ├── models/
│   │   ├── Barbeiro.js         # entidade "mestre"
│   │   └── Agendamento.js      # entidade "detalhe" (referencia Barbeiro)
│   └── routes/
│       ├── barbeiros.js        # rotas CRUD de barbeiros
│       └── agendamentos.js     # rotas CRUD de agendamentos
├── public/                      # front-end (servido como estático pelo Express)
│   ├── index.html              # redireciona para barbeiros.html
│   ├── barbeiros.html          # cadastro e listagem de barbeiros
│   ├── agendamentos.html       # cadastro e listagem de agendamentos
│   ├── css/
│   │   └── style.css           # estilos e temas claro/escuro
│   └── js/
│       ├── api.js              # camada de acesso à API (fetch)
│       ├── theme.js            # alternância e persistência do tema
│       ├── barbeiros.js        # lógica da página de barbeiros
│       └── agendamentos.js     # lógica da página de agendamentos
└── README.md
```

---

## 🔌 Rotas da API

### Barbeiros — `/api/barbeiros`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Lista todos os barbeiros, ordenados por nome |
| GET | `/:id` | Busca um barbeiro pelo ID |
| POST | `/` | Cria um novo barbeiro |
| PUT | `/:id` | Atualiza todos os dados de um barbeiro |
| PATCH | `/:id/status` | Atualiza apenas o campo `ativo` |
| DELETE | `/:id` | Remove um barbeiro |

### Agendamentos — `/api/agendamentos`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Lista todos os agendamentos, ordenados por `dataHora`, com dados do barbeiro populados |
| GET | `/barbeiro/:barbeiroId` | Lista os agendamentos de um barbeiro específico |
| GET | `/:id` | Busca um agendamento pelo ID |
| POST | `/` | Cria um novo agendamento |
| PUT | `/:id` | Atualiza todos os dados de um agendamento |
| PATCH | `/:id/status` | Atualiza apenas o `status` do agendamento |
| DELETE | `/:id` | Remove um agendamento |

---

## ✅ Regras de Negócio e Validações

**No servidor (API):**

- Campos obrigatórios validados em todas as rotas de criação/atualização, retornando `400` quando ausentes
- Um barbeiro não pode ter dois agendamentos `Agendado` no mesmo horário — validação server-side, retornando `409 Conflict`
- O `PATCH` de agendamento só aceita os status `Agendado`, `Concluído` ou `Cancelado`
- O serviço do agendamento é restrito a um conjunto fixo de valores (`enum` no schema): `Corte`, `Barba`, `Corte + Barba`, `Hidratação` ou `Relaxamento`

**No navegador (interface):**

- Validação client-side dos campos obrigatórios dos dois formulários antes do envio da requisição, com feedback imediato por campo
- O select de barbeiro no formulário de agendamento só exibe barbeiros ativos
- Conteúdo dinâmico renderizado nas tabelas é escapado antes da inserção no DOM, evitando que dados cadastrados injetem HTML

---

## ⚙️ Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/matheusydev/Barbearia-PPI-I.git

# Entre na pasta
cd Barbearia-PPI-I

# Instale as dependências
npm install

# Crie o arquivo .env na raiz com:
# MONGO_URI=sua_string_de_conexao_mongodb
# PORT=3000

# Rode em modo desenvolvimento
npm run dev

# ou em modo produção
npm start
```

O servidor estará disponível em `http://localhost:3000`, servindo tanto a API (`/api/...`) quanto a interface (`/barbeiros.html`, `/agendamentos.html`).

---

## 🎓 Aprendizados Adquiridos

- ✅ **Consumo de API com `fetch`** — centralizar chamadas HTTP em uma camada própria (`api.js`) para reaproveitar tratamento de erros
- ✅ **Validação em duas camadas** — replicar no front-end as mesmas regras de obrigatoriedade do back-end, sem abrir mão da validação server-side
- ✅ **Persistência no navegador** — uso do `localStorage` tanto para preferências (tema, ordenação) quanto para cache de dados (modo offline)
- ✅ **Prevenção de XSS no DOM** — escapar dados dinâmicos antes de inseri-los via `innerHTML`
- ✅ **Organização de front-end sem framework** — estruturar HTML, CSS e JS puro em múltiplas páginas mantendo o código legível e reaproveitável
- ✅ **Modelagem de relacionamentos** — uso de `ObjectId` e `ref` no Mongoose para representar relações 1:N
- ✅ **Regras de negócio no servidor** — validação de conflitos de horário antes de persistir um registro
- ✅ **Design de rotas REST** — diferenciação clara entre atualização completa (`PUT`) e parcial (`PATCH`)
- ✅ **Populate do Mongoose** — como referenciar e trazer dados de documentos relacionados
- ✅ **Ordenação no back-end** — definir o critério de ordenação como responsabilidade do servidor, não do cliente
- ✅ **Variáveis de ambiente** — uso de `dotenv` para separar configuração sensível do código


---

## 👥 Equipe

- Matheus Ylan
- Eli Ruan

---
