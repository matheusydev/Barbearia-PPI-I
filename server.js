const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const barbeirosRoutes = require('./src/routes/barbeiros');
const agendamentosRoutes = require('./src/routes/agendamentos');

app.use('/api/barbeiros', barbeirosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Conexão com MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/barbearia';

if (!process.env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI não definida. Usando mongodb://127.0.0.1:27017/barbearia');
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB conectado!');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err.message);
  });