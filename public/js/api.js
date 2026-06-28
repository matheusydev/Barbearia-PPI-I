// api.js — funções de acesso à API REST do back-end
// Centraliza todas as chamadas fetch para as entidades Barbeiro e Agendamento

const API_BASE = '/api';

// Faz a requisição e já trata o formato de erro padrão da API: { erro: 'mensagem' }
async function requisitar(url, opcoes = {}) {
  const resposta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const mensagem = dados.erro || 'Erro inesperado ao comunicar com o servidor';
    throw new Error(mensagem);
  }

  return dados;
}

const ApiBarbeiros = {
  listar() {
    return requisitar(`${API_BASE}/barbeiros`);
  },
  buscar(id) {
    return requisitar(`${API_BASE}/barbeiros/${id}`);
  },
  criar(dados) {
    return requisitar(`${API_BASE}/barbeiros`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },
  atualizar(id, dados) {
    return requisitar(`${API_BASE}/barbeiros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },
  alterarStatus(id, ativo) {
    return requisitar(`${API_BASE}/barbeiros/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo }),
    });
  },
  remover(id) {
    return requisitar(`${API_BASE}/barbeiros/${id}`, {
      method: 'DELETE',
    });
  },
};

const ApiAgendamentos = {
  listar() {
    return requisitar(`${API_BASE}/agendamentos`);
  },
  buscar(id) {
    return requisitar(`${API_BASE}/agendamentos/${id}`);
  },
  criar(dados) {
    return requisitar(`${API_BASE}/agendamentos`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },
  atualizar(id, dados) {
    return requisitar(`${API_BASE}/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },
  alterarStatus(id, status) {
    return requisitar(`${API_BASE}/agendamentos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  remover(id) {
    return requisitar(`${API_BASE}/agendamentos/${id}`, {
      method: 'DELETE',
    });
  },
};
