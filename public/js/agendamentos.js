// agendamentos.js — lógica da página de Agendamentos

const CHAVE_CACHE_AGENDAMENTOS = 'barbearia:cache:agendamentos';
const CHAVE_ORDENACAO_AGENDAMENTOS = 'barbearia:ordenacao:agendamentos';

let listaAgendamentos = [];
let idEmEdicao = null;

const elementos = {
  form: document.getElementById('form-agendamento'),
  id: document.getElementById('agendamento-id'),
  clienteNome: document.getElementById('clienteNome'),
  clienteTelefone: document.getElementById('clienteTelefone'),
  servico: document.getElementById('servico'),
  dataHora: document.getElementById('dataHora'),
  barbeiro: document.getElementById('barbeiro'),
  campoStatus: document.getElementById('campo-status'),
  status: document.getElementById('status'),
  tituloForm: document.getElementById('titulo-form'),
  botaoSalvar: document.getElementById('botao-salvar'),
  botaoCancelar: document.getElementById('botao-cancelar'),
  mensagemForm: document.getElementById('mensagem-form'),
  corpoTabela: document.getElementById('lista-agendamentos'),
  ordenacao: document.getElementById('ordenacao'),
  avisoOffline: document.getElementById('aviso-offline'),
};

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function classeStatus(status) {
  if (status === 'Agendado') return 'agendado';
  if (status === 'Cancelado') return 'cancelado';
  return 'concluido';
}

function formatarDataHora(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Converte um valor de <input type="datetime-local"> para ISO 8601 (envio à API)
function localParaIso(valorLocal) {
  return new Date(valorLocal).toISOString();
}

// Converte uma data ISO vinda da API para o formato aceito por <input type="datetime-local">
function isoParaLocal(iso) {
  const data = new Date(iso);
  return data.toISOString().slice(0, 16);
}

// ---------- Validação client-side (item 2 do trabalho) ----------

function limparErros() {
  ['clienteNome', 'clienteTelefone', 'servico', 'dataHora', 'barbeiro'].forEach((campo) => {
    document.getElementById(`erro-${campo}`).textContent = '';
    document.getElementById(campo).classList.remove('invalido');
  });
}

function marcarErro(campo, mensagem) {
  document.getElementById(`erro-${campo}`).textContent = mensagem;
  document.getElementById(campo).classList.add('invalido');
}

function validarFormulario() {
  limparErros();
  let valido = true;

  if (!elementos.clienteNome.value.trim()) {
    marcarErro('clienteNome', 'Informe o nome do cliente.');
    valido = false;
  }
  if (!elementos.clienteTelefone.value.trim()) {
    marcarErro('clienteTelefone', 'Informe o telefone do cliente.');
    valido = false;
  }
  if (!elementos.servico.value) {
    marcarErro('servico', 'Selecione o serviço.');
    valido = false;
  }
  if (!elementos.dataHora.value) {
    marcarErro('dataHora', 'Informe a data e hora.');
    valido = false;
  }
  if (!elementos.barbeiro.value) {
    marcarErro('barbeiro', 'Selecione o barbeiro.');
    valido = false;
  }

  return valido;
}

function mostrarMensagem(tipo, texto) {
  elementos.mensagemForm.className = `mensagem ${tipo}`;
  elementos.mensagemForm.textContent = texto;
}

function limparMensagem() {
  elementos.mensagemForm.className = 'mensagem';
  elementos.mensagemForm.textContent = '';
}

// ---------- Cache offline no localStorage (item 5 do trabalho) ----------

function salvarCache(lista) {
  localStorage.setItem(CHAVE_CACHE_AGENDAMENTOS, JSON.stringify(lista));
}

function lerCache() {
  const dados = localStorage.getItem(CHAVE_CACHE_AGENDAMENTOS);
  return dados ? JSON.parse(dados) : null;
}

// ---------- Ordenação (persistida no localStorage) ----------

const ORDEM_STATUS = { Agendado: 0, Concluído: 1, Cancelado: 2 };

function ordenarLista(lista, criterio) {
  const copia = [...lista];
  switch (criterio) {
    case 'data-desc':
      return copia.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    case 'status':
      return copia.sort((a, b) => ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status]);
    case 'cliente':
      return copia.sort((a, b) => a.clienteNome.localeCompare(b.clienteNome));
    case 'data-asc':
    default:
      return copia.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
  }
}

function aplicarOrdenacaoSalva() {
  const salva = localStorage.getItem(CHAVE_ORDENACAO_AGENDAMENTOS) || 'data-asc';
  elementos.ordenacao.value = salva;
}

elementos.ordenacao.addEventListener('change', () => {
  localStorage.setItem(CHAVE_ORDENACAO_AGENDAMENTOS, elementos.ordenacao.value);
  renderizarLista();
});

// ---------- Barbeiros disponíveis para o select ----------

let barbeirosDisponiveis = [];

async function carregarBarbeirosNoSelect() {
  try {
    const todos = await ApiBarbeiros.listar();
    barbeirosDisponiveis = todos.filter((b) => b.ativo);
  } catch {
    barbeirosDisponiveis = [];
  }

  const valorAtual = elementos.barbeiro.value;
  elementos.barbeiro.innerHTML = '<option value="">Selecione...</option>' +
    barbeirosDisponiveis.map((b) => `<option value="${b._id}">${escaparHtml(b.nome)} — ${escaparHtml(b.especialidade)}</option>`).join('');
  if (valorAtual) elementos.barbeiro.value = valorAtual;
}

// ---------- Renderização ----------

function renderizarLista() {
  const ordenada = ordenarLista(listaAgendamentos, elementos.ordenacao.value);

  if (ordenada.length === 0) {
    elementos.corpoTabela.innerHTML = '<tr><td colspan="6" class="vazio">Nenhum agendamento cadastrado ainda.</td></tr>';
    return;
  }

  elementos.corpoTabela.innerHTML = ordenada.map((a) => `
    <tr>
      <td>${escaparHtml(a.clienteNome)}</td>
      <td>${escaparHtml(a.servico)}</td>
      <td>${formatarDataHora(a.dataHora)}</td>
      <td>${a.barbeiro ? escaparHtml(a.barbeiro.nome) : '<em>removido</em>'}</td>
      <td><span class="selo ${classeStatus(a.status)}">${escaparHtml(a.status)}</span></td>
      <td>
        <div class="acoes-tabela">
          <button data-acao="editar" data-id="${a._id}">Editar</button>
          <button data-acao="concluir" data-id="${a._id}">Concluir</button>
          <button data-acao="cancelar" data-id="${a._id}">Cancelar</button>
          <button data-acao="excluir" data-id="${a._id}">Excluir</button>
        </div>
      </td>
    </tr>
  `).join('');
}

elementos.corpoTabela.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;

  const { acao, id } = botao.dataset;

  if (acao === 'editar') {
    entrarModoEdicao(id);
  } else if (acao === 'concluir' || acao === 'cancelar') {
    const novoStatus = acao === 'concluir' ? 'Concluído' : 'Cancelado';
    try {
      await ApiAgendamentos.alterarStatus(id, novoStatus);
      await carregarAgendamentos();
    } catch (erro) {
      alert(erro.message);
    }
  } else if (acao === 'excluir') {
    if (confirm('Tem certeza que deseja remover este agendamento?')) {
      try {
        await ApiAgendamentos.remover(id);
        await carregarAgendamentos();
      } catch (erro) {
        alert(erro.message);
      }
    }
  }
});

function entrarModoEdicao(id) {
  const agendamento = listaAgendamentos.find((a) => a._id === id);
  if (!agendamento) return;

  idEmEdicao = id;
  elementos.id.value = id;
  elementos.clienteNome.value = agendamento.clienteNome;
  elementos.clienteTelefone.value = agendamento.clienteTelefone;
  elementos.servico.value = agendamento.servico;
  elementos.dataHora.value = isoParaLocal(agendamento.dataHora);
  elementos.barbeiro.value = agendamento.barbeiro ? agendamento.barbeiro._id : '';
  elementos.campoStatus.style.display = 'flex';
  elementos.status.value = agendamento.status;
  elementos.tituloForm.textContent = 'Editar agendamento';
  elementos.botaoSalvar.textContent = 'Salvar alterações';
  elementos.botaoCancelar.style.display = 'inline-block';
  limparErros();
  limparMensagem();
  elementos.form.scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicao() {
  idEmEdicao = null;
  elementos.form.reset();
  elementos.id.value = '';
  elementos.campoStatus.style.display = 'none';
  elementos.tituloForm.textContent = 'Novo agendamento';
  elementos.botaoSalvar.textContent = 'Agendar';
  elementos.botaoCancelar.style.display = 'none';
  limparErros();
}

elementos.botaoCancelar.addEventListener('click', sairModoEdicao);

// ---------- Carregamento (com fallback para o cache offline) ----------

async function carregarAgendamentos() {
  try {
    listaAgendamentos = await ApiAgendamentos.listar();
    salvarCache(listaAgendamentos);
    elementos.avisoOffline.style.display = 'none';
  } catch (erro) {
    const cache = lerCache();
    if (cache) {
      listaAgendamentos = cache;
      elementos.avisoOffline.style.display = 'block';
    } else {
      elementos.corpoTabela.innerHTML = `<tr><td colspan="6" class="vazio">${escaparHtml(erro.message)}</td></tr>`;
      return;
    }
  }
  renderizarLista();
}

// ---------- Envio do formulário ----------

elementos.form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparMensagem();

  if (!validarFormulario()) {
    return;
  }

  const dados = {
    clienteNome: elementos.clienteNome.value.trim(),
    clienteTelefone: elementos.clienteTelefone.value.trim(),
    servico: elementos.servico.value,
    dataHora: localParaIso(elementos.dataHora.value),
    barbeiro: elementos.barbeiro.value,
  };

  if (idEmEdicao) {
    dados.status = elementos.status.value;
  }

  try {
    if (idEmEdicao) {
      await ApiAgendamentos.atualizar(idEmEdicao, dados);
      mostrarMensagem('sucesso', 'Agendamento atualizado com sucesso.');
    } else {
      await ApiAgendamentos.criar(dados);
      mostrarMensagem('sucesso', 'Agendamento criado com sucesso.');
    }
    sairModoEdicao();
    await carregarAgendamentos();
  } catch (erro) {
    mostrarMensagem('erro', erro.message);
  }
});

// ---------- Inicialização ----------

aplicarOrdenacaoSalva();
carregarBarbeirosNoSelect();
carregarAgendamentos();
