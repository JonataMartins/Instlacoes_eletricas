// script.js (substitua todo o arquivo por este)

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded - script carregado");

  let comodos = [];
  let listaTUE = [];

  // helpers
  function $(id) { return document.getElementById(id); }
  function criarAcoesSeNaoExistir() {
    let acoes = $('acoesQDG');
    if (!acoes) {
      console.log("Div #acoesQDG não encontrada — criando dinamicamente");
      acoes = document.createElement('div');
      acoes.id = 'acoesQDG';
      acoes.style.display = 'none';
      acoes.style.marginTop = '20px';
      acoes.innerHTML = `
        <button id="baixarCSV">Baixar Tabela (CSV)</button>
        <button id="resetarTudo">Resetar Tudo</button>
      `;
      const qdgSection = $('qdg-section') || document.body;
      qdgSection.appendChild(acoes);
    }
    return acoes;
  }

  // Inicializa a área de ações (garante existência)
  criarAcoesSeNaoExistir();

  // Elementos
  const btnAdd = $('addComodo');
  const btnGerar = $('gerarQDG');

  // Safety: confirma elementos essenciais
  if (!btnAdd) console.warn("Botão addComodo não encontrado no DOM");
  if (!btnGerar) console.warn("Botão gerarQDG não encontrado no DOM");

  // Função para atualizar tabela de cômodos
  function atualizarTabelaComodos() {
  const tbody = document.querySelector('#tabelaComodos tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  comodos.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.tipoArea}</td>
      <td>${c.tensao}</td>
      <td>${c.comprimento}</td>
      <td>${c.largura}</td>
      <td>${c.area}</td>
    `;
    tbody.appendChild(tr);
  });

  // ✅ Atualiza o select de TUE
  const selectTUE = $('tue-comodo');
  if (selectTUE) {
    selectTUE.innerHTML = `<option value="">Selecione o cômodo</option>`;
    comodos.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.nome;
      opt.textContent = c.nome;
      selectTUE.appendChild(opt);
    });
  }
}

  // Evento adicionar cômodo
  if (btnAdd) {
    btnAdd.addEventListener('click', (ev) => {
      ev.preventDefault();
      console.log("addComodo clicado");

      const nome = $('nome').value.trim();
      const tipoArea = $('tipoArea').value;
      const tensao = $('tensao').value;
      const comprimento = parseFloat($('comprimento').value);
      const largura = parseFloat($('largura').value);

      console.log(tensao);

      if (!nome || !comprimento || !tensao || !largura || isNaN(comprimento) || isNaN(largura)) {
        alert('Preencha todos os campos corretamente.');
        return;
      }

      const area = (comprimento * largura).toFixed(2);
      comodos.push({ nome, tipoArea, tensao, comprimento, largura, area });
      atualizarTabelaComodos();

      $('nome').value = '';
      $('comprimento').value = '';
      $('largura').value = '';
    });
  }

  // ---------------------- TUE (Tomadas de Uso Específico) ----------------------

  const btnAddTUE = $('addTUE');

  function atualizarTabelaTUE() {
  const tbody = document.querySelector('#tabelaTUE tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  listaTUE.forEach(tue => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tue.nome}</td>
      <td>${tue.nomeComodo}</td>
      <td>${tue.tensao} V</td>
      <td>${tue.potencia} VA</td>
    `;
    tbody.appendChild(tr);
  });
}

if (btnAddTUE) {
  btnAddTUE.addEventListener('click', (ev) => {
    ev.preventDefault();

    const nome = $('tue-nome').value.trim();
    const nomeComodo = $('tue-comodo').value;
    const potencia = Number($('tue-potencia').value);

    if (!nome || !nomeComodo || potencia <= 0 || isNaN(potencia)) {
      alert("Preencha corretamente a TUE.");
      return;
    }

    // ✅ buscar tensão do cômodo selecionado
    const comodoRef = comodos.find(c => c.nome === nomeComodo);
    const tensao = comodoRef ? Number(comodoRef.tensao) : 127;

    listaTUE.push({ nome, nomeComodo, tensao, potencia });

    atualizarTabelaTUE();

    $('tue-nome').value = '';
    $('tue-potencia').value = '';
    $('tue-comodo').value = '';
  });
}

  // Função que renderiza tabela QDG no DOM (garante id tabelaQDG)
  function mostrarTabelaQDG(tabela) {
    console.log("mostrarTabelaQDG chamado - recebidos", tabela.length, "linhas");
    const div = $('resultado');
    if (!div) {
      console.error("#resultado não encontrado");
      return;
    }

    // Gera HTML com id na tabela
    div.innerHTML = `
      <h2>Tabela QDG Gerada</h2>
      <table id="tabelaQDG">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Descrição</th>
            <th>Tensão</th>
            <th>Potência</th>
            <th>Corrente</th>
            <th>Disjuntor</th>
            <th>Seção</th>
            <th>DR</th>
            <th>Barramento</th>
          </tr>
        </thead>
        <tbody>
          ${tabela.map(c => `
            <tr>
              <td>${c.Circuito}</td>
              <td>${c.Descrição}</td>
              <td>${c.Tensão}</td>
              <td>${c.Potência}</td>
              <td>${c.Corrente}</td>
              <td>${c.Disjuntor}</td>
              <td>${c.Seção}</td>
              <td>${c.DR}</td>
              <td>${c.Barramento}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Mostrar os botões (cria se não existir)
    const acoes = criarAcoesSeNaoExistir();
    acoes.style.display = 'block';

    // (Re)attach listeners para os botões — safe attach evitando duplicação
    const btnCSV = $('baixarCSV');
    const btnReset = $('resetarTudo');

    if (btnCSV) {
      btnCSV.replaceWith(btnCSV.cloneNode(true));
      $('baixarCSV').addEventListener('click', baixarCSV);
    } else {
      console.warn("Botão #baixarCSV não encontrado após gerar tabela");
    }

    if (btnReset) {
      btnReset.replaceWith(btnReset.cloneNode(true));
      $('resetarTudo').addEventListener('click', resetarTudo);
    } else {
      console.warn("Botão #resetarTudo não encontrado após gerar tabela");
    }
  }

  // Função de download CSV (lê tabela gerada)
  function baixarCSV() {
    const tabela = $('tabelaQDG');
    if (!tabela) {
      alert("Gere a tabela primeiro.");
      return;
    }

    let csv = [];
    const rows = tabela.querySelectorAll("tr");
    rows.forEach(row => {
      const cols = row.querySelectorAll("th, td");
      let linha = [];
      cols.forEach(col => linha.push(col.innerText.replace(/;/g, ",")));
      csv.push(linha.join(";"));
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabela_qdg.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    console.log("Download CSV iniciado");
  }

  // Reset
  function resetarTudo() {
    if (!confirm("Tem certeza que deseja limpar tudo?")) return;
    comodos = [];
    const tbody = document.querySelector('#tabelaComodos tbody');
    if (tbody) tbody.innerHTML = "";
    const resultado = $('resultado');
    if (resultado) resultado.innerHTML = "";
    const acoes = $('acoesQDG');
    if (acoes) acoes.style.display = 'none';
    console.log("Aplicação resetada");
    alert("Tudo foi resetado!");
  }

  // Evento gerarQDG — chama backend e renderiza
  if (btnGerar) {
    btnGerar.addEventListener('click', async (ev) => {
      ev.preventDefault();
      console.log("gerarQDG clicado - enviando comodos:", comodos.length);
      if (comodos.length === 0) {
        alert('Adicione pelo menos um cômodo antes de gerar o QDG.');
        return;
      }

      try {
        const resposta = await fetch('/comodos/gerarQDG', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comodos, tues: listaTUE })
        });

        console.log("Requisição /comodos/gerarQDG status:", resposta.status);
        const data = await resposta.json();

        if (data.erro) {
          console.error("Erro retornado pelo servidor:", data.erro);
          throw new Error(data.erro);
        }

        mostrarTabelaQDG(data.tabela);
      } catch (e) {
        console.error("Erro ao gerar QDG:", e);
        alert('Erro ao gerar a tabela QDG: ' + (e.message || e));
      }
    });
  }


  const acoesDebug = $('acoesQDG');
  if (acoesDebug) {
    const btnCSV = $('baixarCSV');
    if (btnCSV) btnCSV.addEventListener('click', baixarCSV);
    const btnReset = $('resetarTudo');
    if (btnReset) btnReset.addEventListener('click', resetarTudo);
  }

});
