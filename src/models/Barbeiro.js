const mongoose = require('mongoose');

const barbeiroSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    especialidade: {
      type: String,
      required: [true, 'Especialidade é obrigatória'],
      trim: true,
    },
    telefone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      trim: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Barbeiro', barbeiroSchema);