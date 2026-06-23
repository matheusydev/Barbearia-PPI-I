const express = require('express');
const router = express.Router();
const Barbeiro = require('../models/Barbeiro');

// GET — listar todos os barbeiros (ordenado por nome)
router.get('/', async (req, res) => {
  try {
    const barbeiros = await Barbeiro.find().sort({ nome: 1 });
    res.json(barbeiros);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET — buscar barbeiro por ID
router.get('/:id', async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findById(req.params.id);
    if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro não encontrado' });
    res.json(barbeiro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST — criar barbeiro
router.post('/', async (req, res) => {
  try {
    const { nome, especialidade, telefone } = req.body;

    // Validação no servidor
    if (!nome || !especialidade || !telefone) {
      return res.status(400).json({ erro: 'Nome, especialidade e telefone são obrigatórios' });
    }

    const barbeiro = new Barbeiro({ nome, especialidade, telefone });
    await barbeiro.save();
    res.status(201).json(barbeiro);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// PUT — atualizar barbeiro completo
router.put('/:id', async (req, res) => {
  try {
    const { nome, especialidade, telefone, ativo } = req.body;

    if (!nome || !especialidade || !telefone) {
      return res.status(400).json({ erro: 'Nome, especialidade e telefone são obrigatórios' });
    }

    const barbeiro = await Barbeiro.findByIdAndUpdate(
      req.params.id,
      { nome, especialidade, telefone, ativo },
      { new: true, runValidators: true }
    );
    if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro não encontrado' });
    res.json(barbeiro);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// PATCH — atualizar apenas o status ativo/inativo
router.patch('/:id/status', async (req, res) => {
  try {
    const { ativo } = req.body;

    if (typeof ativo !== 'boolean') {
      return res.status(400).json({ erro: 'Campo ativo deve ser true ou false' });
    }

    const barbeiro = await Barbeiro.findByIdAndUpdate(
      req.params.id,
      { ativo },
      { new: true }
    );
    if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro não encontrado' });
    res.json(barbeiro);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE — remover barbeiro
router.delete('/:id', async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findByIdAndDelete(req.params.id);
    if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro não encontrado' });
    res.json({ mensagem: 'Barbeiro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;