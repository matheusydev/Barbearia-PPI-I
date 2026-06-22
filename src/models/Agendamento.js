const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema(
  {
    clienteNome: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório'],
      trim: true,
    },
    clienteTelefone: {
      type: String,
      required: [true, 'Telefone do cliente é obrigatório'],
      trim: true,
    },
    servico: {
      type: String,
      required: [true, 'Serviço é obrigatório'],
      enum: ['Corte', 'Barba', 'Corte + Barba', 'Hidratação', 'Relaxamento'],
    },
    dataHora: {
      type: Date,
      required: [true, 'Data e hora são obrigatórios'],
    },
    status: {
      type: String,
      enum: ['Agendado', 'Concluído', 'Cancelado'],
      default: 'Agendado',
    },
    barbeiro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barbeiro',
      required: [true, 'Barbeiro é obrigatório'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Agendamento', agendamentoSchema);