// barbeiros.js — lógica da página de Barbeiros

const CHAVE_CACHE_BARBEIROS = 'barbearia:cache:barbeiros';
const CHAVE_ORDENACAO_BARBEIROS = 'barbearia:ordenacao:barbeiros';

let listaBarbeiros = [];
let idEmEdicao = null;

const elementos = {
  form: document.getElementById('form-barbeiro'),
  id: document.getElementById('barbeiro-id'),
  nome: document.getElementById('nome'),
  especialidade: document.getElementById('especialidade'),
  telefone: document.getElementById('telefone'),
  tituloForm: document.getElementById('titulo-form'),
  botaoSalvar: document.getElementById('botao-salvar'),
  botaoCancelar: document.getElementById('botao-cancelar'),
  mensagemForm: document.getElementById('mensagem-form'),
  corpoTabela: document.getElementById('lista-barbeiros'),
  ordenacao: document.getElementById('ordenacao'),
  avisoOffline: document.getElementById('aviso-offline'),
};

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// ---------- Validação client-side (item 2 do trabalho) ----------

function limparErros() {
  ['nome', 'especialidade', 'telefone'].forEach((campo) => {
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

  if (!elementos.nome.value.trim()) {
    marcarErro('nome', 'Informe o nome do barbeiro.');
    valido = false;
  }
  if (!elementos.especialidade.value.trim()) {
    marcarErro('especialidade', 'Informe a especialidade.');
    valido = false;
  }
  if (!elementos.telefone.value.trim()) {
    marcarErro('telefone', 'Informe o telefone.');
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
  localStorage.setItem(CHAVE_CACHE_BARBEIROS, JSON.stringify(lista));
}

function lerCache() {
  const dados = localStorage.getItem(CHAVE_CACHE_BARBEIROS);
  return dados ? JSON.parse(dados) : null;
}

// ---------- Ordenação (lida do localStorage para persistir entre acessos) ----------

function ordenarLista(lista, criterio) {
  const copia = [...lista];
  switch (criterio) {
    case 'nome-desc':
      return copia.sort((a, b) => b.nome.localeCompare(a.nome));
    case 'especialidade-asc':
      return copia.sort((a, b) => a.especialidade.localeCompare(b.especialidade));
    case 'nome-asc':
    default:
      return copia.sort((a, b) => a.nome.localeCompare(b.nome));
  }
}

function aplicarOrdenacaoSalva() {
  const salva = localStorage.getItem(CHAVE_ORDENACAO_BARBEIROS) || 'nome-asc';
  elementos.ordenacao.value = salva;
}

elementos.ordenacao.addEventListener('change', () => {
  localStorage.setItem(CHAVE_ORDENACAO_BARBEIROS, elementos.ordenacao.value);
  renderizarLista();
});

// ---------- Renderização ----------

function renderizarLista() {
  const ordenada = ordenarLista(listaBarbeiros, elementos.ordenacao.value);

  if (ordenada.length === 0) {
    elementos.corpoTabela.innerHTML = '<tr><td colspan="5" class="vazio">Nenhum barbeiro cadastrado ainda.</td></tr>';
    return;
  }

  elementos.corpoTabela.innerHTML = ordenada.map((b) => `
    <tr>
      <td>${escaparHtml(b.nome)}</td>
      <td>${escaparHtml(b.especialidade)}</td>
      <td>${escaparHtml(b.telefone)}</td>
      <td><span class="selo ${b.ativo ? 'ativo' : 'inativo'}">${b.ativo ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        <div class="acoes-tabela">
          <button data-acao="editar" data-id="${b._id}">Editar</button>
          <button data-acao="status" data-id="${b._id}" data-ativo="${b.ativo}">${b.ativo ? 'Inativar' : 'Ativar'}</button>
          <button data-acao="excluir" data-id="${b._id}">Excluir</button>
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
  } else if (acao === 'status') {
    const ativoAtual = botao.dataset.ativo === 'true';
    try {
      await ApiBarbeiros.alterarStatus(id, !ativoAtual);
      await carregarBarbeiros();
    } catch (erro) {
      alert(erro.message);
    }
  } else if (acao === 'excluir') {
    if (confirm('Tem certeza que deseja remover este barbeiro?')) {
      try {
        await ApiBarbeiros.remover(id);
        await carregarBarbeiros();
      } catch (erro) {
        alert(erro.message);
      }
    }
  }
});

function entrarModoEdicao(id) {
  const barbeiro = listaBarbeiros.find((b) => b._id === id);
  if (!barbeiro) return;

  idEmEdicao = id;
  elementos.id.value = id;
  elementos.nome.value = barbeiro.nome;
  elementos.especialidade.value = barbeiro.especialidade;
  elementos.telefone.value = barbeiro.telefone;
  elementos.tituloForm.textContent = 'Editar barbeiro';
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
  elementos.tituloForm.textContent = 'Novo barbeiro';
  elementos.botaoSalvar.textContent = 'Cadastrar';
  elementos.botaoCancelar.style.display = 'none';
  limparErros();
}

elementos.botaoCancelar.addEventListener('click', sairModoEdicao);

// ---------- Carregamento (com fallback para o cache offline) ----------

async function carregarBarbeiros() {
  try {
    listaBarbeiros = await ApiBarbeiros.listar();
    salvarCache(listaBarbeiros);
    elementos.avisoOffline.style.display = 'none';
  } catch (erro) {
    const cache = lerCache();
    if (cache) {
      listaBarbeiros = cache;
      elementos.avisoOffline.style.display = 'block';
    } else {
      elementos.corpoTabela.innerHTML = `<tr><td colspan="5" class="vazio">${escaparHtml(erro.message)}</td></tr>`;
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
    nome: elementos.nome.value.trim(),
    especialidade: elementos.especialidade.value.trim(),
    telefone: elementos.telefone.value.trim(),
  };

  try {
    if (idEmEdicao) {
      await ApiBarbeiros.atualizar(idEmEdicao, dados);
      mostrarMensagem('sucesso', 'Barbeiro atualizado com sucesso.');
    } else {
      await ApiBarbeiros.criar(dados);
      mostrarMensagem('sucesso', 'Barbeiro cadastrado com sucesso.');
    }
    sairModoEdicao();
    await carregarBarbeiros();
  } catch (erro) {
    mostrarMensagem('erro', erro.message);
  }
});

// ---------- Inicialização ----------

aplicarOrdenacaoSalva();
carregarBarbeiros();
