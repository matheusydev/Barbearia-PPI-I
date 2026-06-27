<div align="center">

# 💈 Barbearia PPI-I

API REST para gerenciamento de uma barbearia, desenvolvida em grupo como trabalho da disciplina **Programação para Internet I**, com cadastro de barbeiros e agendamentos de clientes em relação mestre-detalhe.

<!-- 🔗 **Hospedagem:** em desenvolvimento (front-end ainda não publicado)

🎥 **Vídeo de apresentação:** em desenvolvimento -->

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

</div>

---

## 📝 Descrição do Projeto

O projeto consiste em uma API REST construída com Node.js e Express, persistindo dados em MongoDB através do Mongoose. A API expõe rotas completas (GET, POST, PUT, PATCH, DELETE) para as entidades `Barbeiro` e `Agendamento`, com validações de regras de negócio no servidor e ordenação definida para as listagens. O front-end (HTML, CSS, JavaScript com manipulação do DOM e `localStorage`) está em desenvolvimento e vai consumir essa API.

---

## 🏗️ O que foi desenvolvido

- Modelagem das entidades `Barbeiro` e `Agendamento` com Mongoose, em relação 1:N
- Rotas REST completas (GET, POST, PUT, PATCH, DELETE) para as duas entidades
- Validação de campos obrigatórios no servidor, com mensagens de erro específicas por campo (via `required` do Mongoose)
- Regra de negócio server-side: impedir que um barbeiro tenha dois agendamentos com status `Agendado` no mesmo horário
- Rota dedicada para listar agendamentos por barbeiro (`/api/agendamentos/barbeiro/:barbeiroId`)
- `populate` do Mongoose para retornar os dados do barbeiro junto do agendamento
- Ordenação definida no servidor: barbeiros por `nome`, agendamentos por `dataHora`
- Configuração de variáveis de ambiente com `dotenv` e middleware `cors`

---

## ⚡ Principais Desafios Encontrados

- **Conflito de horário entre agendamentos** — implementar a regra de negócio que impede dois agendamentos `Agendado` para o mesmo barbeiro no mesmo horário, validando tanto na criação (`POST`) quanto na edição (`PUT`, excluindo o próprio registro da verificação)
- **Relacionamento entre entidades no Mongoose** — usar `ObjectId` com `ref` no schema de `Agendamento` e `populate()` para trazer os dados do barbeiro junto da listagem
- **Definir PUT vs PATCH** — separar o que é atualização completa (`PUT`) do que é atualização parcial de um único campo, como o `status` do agendamento ou o `ativo` do barbeiro
- **Ordenação no servidor** — decidir o critério de ordenação adequado para cada entidade (nome para barbeiros, data/hora para agendamentos) em vez de deixar isso a cargo do cliente

---

## 📋 Entidades do Sistema

- **Barbeiro** *(mestre)* — nome, especialidade, telefone e status ativo/inativo
- **Agendamento** *(detalhe)* — dados do cliente, serviço escolhido, data/hora, status e referência ao barbeiro

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| Node.js | Ambiente de execução do servidor |
| Express 5 | Criação das rotas e middleware da API REST |
| MongoDB | Banco de dados NoSQL para persistência |
| Mongoose | Modelagem de schemas e validações |
| CORS | Liberação de requisições do front-end |
| dotenv | Variáveis de ambiente |
| Nodemon | Reinício automático em desenvolvimento |

---

## ✨ Funcionalidades

- CRUD completo de barbeiros (criar, listar, buscar por ID, atualizar, ativar/inativar, remover)
- CRUD completo de agendamentos (criar, listar, buscar por ID, atualizar, alterar status, remover)
- Listagem de agendamentos filtrada por barbeiro
- Validação de campos obrigatórios no servidor
- Bloqueio de agendamentos conflitantes para o mesmo barbeiro e horário
- Ordenação automática das listagens no servidor

---

## 📁 Estrutura de Pastas

```bash
Barbearia-PPI-I/
├── server.js                  # ponto de entrada da aplicação
├── package.json
├── .env                        # variáveis de ambiente (não versionado)
├── src/
│   ├── models/
│   │   ├── Barbeiro.js        # entidade "mestre"
│   │   └── Agendamento.js     # entidade "detalhe" (referencia Barbeiro)
│   └── routes/
│       ├── barbeiros.js       # rotas CRUD de barbeiros
│       └── agendamentos.js    # rotas CRUD de agendamentos
├── public/                     # front-end (HTML/CSS/JS) — em desenvolvimento
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

- Campos obrigatórios validados no servidor em todas as rotas de criação/atualização, retornando `400` quando ausentes
- Um barbeiro não pode ter dois agendamentos `Agendado` no mesmo horário — validação server-side, retornando `409 Conflict`
- O `PATCH` de agendamento só aceita os status `Agendado`, `Concluído` ou `Cancelado`
- *(Pendente)* Validação client-side dos campos obrigatórios antes do envio da requisição

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

O servidor estará disponível em `http://localhost:3000`.

---



## 🎓 Aprendizados Adquiridos

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

