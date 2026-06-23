const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

// GET — listar todos os agendamentos (ordenado por data/hora)
router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('barbeiro', 'nome especialidade')
      .sort({ dataHora: 1 });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET — listar agendamentos por barbeiro
router.get('/barbeiro/:barbeiroId', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ barbeiro: req.params.barbeiroId })
      .populate('barbeiro', 'nome especialidade')
      .sort({ dataHora: 1 });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET — buscar agendamento por ID
router.get('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id)
      .populate('barbeiro', 'nome especialidade');
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST — criar agendamento
router.post('/', async (req, res) => {
  try {
    const { clienteNome, clienteTelefone, servico, dataHora, barbeiro } = req.body;

    // Validação no servidor
    if (!clienteNome || !clienteTelefone || !servico || !dataHora || !barbeiro) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Regra de negócio: barbeiro não pode ter dois agendamentos no mesmo horário
    const conflito = await Agendamento.findOne({
      barbeiro,
      dataHora: new Date(dataHora),
      status: 'Agendado',
    });

    if (conflito) {
      return res.status(409).json({ erro: 'Barbeiro já possui um agendamento nesse horário' });
    }

    const agendamento = new Agendamento({ clienteNome, clienteTelefone, servico, dataHora, barbeiro });
    await agendamento.save();
    res.status(201).json(agendamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// PUT — atualizar agendamento completo
router.put('/:id', async (req, res) => {
  try {
    const { clienteNome, clienteTelefone, servico, dataHora, barbeiro, status } = req.body;

    if (!clienteNome || !clienteTelefone || !servico || !dataHora || !barbeiro) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Regra de negócio: verificar conflito de horário (exceto o próprio agendamento)
    const conflito = await Agendamento.findOne({
      barbeiro,
      dataHora: new Date(dataHora),
      status: 'Agendado',
      _id: { $ne: req.params.id },
    });

    if (conflito) {
      return res.status(409).json({ erro: 'Barbeiro já possui um agendamento nesse horário' });
    }

    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      { clienteNome, clienteTelefone, servico, dataHora, barbeiro, status },
      { new: true, runValidators: true }
    );
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
    res.json(agendamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// PATCH — atualizar apenas o status do agendamento
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const statusPermitidos = ['Agendado', 'Concluído', 'Cancelado'];

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
    res.json(agendamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE — remover agendamento
router.delete('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
    res.json({ mensagem: 'Agendamento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;