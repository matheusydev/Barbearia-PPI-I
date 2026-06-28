// theme.js — alterna entre tema claro e escuro e persiste a escolha no localStorage
// Uso do localStorage (item 5 do trabalho): lembrar o tema entre páginas e recarregamentos

(function () {
  const CHAVE_TEMA = 'barbearia:tema';

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    const botao = document.getElementById('alternar-tema');
    if (botao) {
      botao.textContent = tema === 'dark' ? '☀️ Claro' : '🌙 Escuro';
    }
  }

  function obterTemaSalvo() {
    return localStorage.getItem(CHAVE_TEMA) || 'light';
  }

  function alternarTema() {
    const atual = document.documentElement.getAttribute('data-tema');
    const novo = atual === 'dark' ? 'light' : 'dark';
    localStorage.setItem(CHAVE_TEMA, novo);
    aplicarTema(novo);
  }

  // Aplica o tema salvo assim que possível, antes do resto da página carregar
  aplicarTema(obterTemaSalvo());

  document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('alternar-tema');
    if (botao) {
      botao.addEventListener('click', alternarTema);
    }
  });
})();
