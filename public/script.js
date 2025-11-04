let comodos = [];

document.getElementById('addComodo').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const tipoArea = document.getElementById('tipoArea').value;
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const largura = parseFloat(document.getElementById('largura').value);

    if (!nome || !comprimento || !largura) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const area = (comprimento * largura).toFixed(2);

    comodos.push({ nome, tipoArea, comprimento, largura, area });
    atualizarTabelaComodos();

    // Limpa campos
    document.getElementById('nome').value = '';
    document.getElementById('comprimento').value = '';
    document.getElementById('largura').value = '';
});

function atualizarTabelaComodos() {
    const tbody = document.querySelector('#tabelaComodos tbody');
    tbody.innerHTML = '';

    comodos.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.nome}</td>
            <td>${c.tipoArea}</td>
            <td>${c.comprimento}</td>
            <td>${c.largura}</td>
            <td>${c.area}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('gerarQDG').addEventListener('click', async () => {
    if (comodos.length === 0) {
        alert('Adicione pelo menos um cômodo antes de gerar o QDG.');
        return;
    }

    try {
        const resposta = await fetch('/comodos/gerarQDG', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comodos })
        });

        const data = await resposta.json();
        if (data.erro) throw new Error(data.erro);

        mostrarTabelaQDG(data.tabela);
    } catch (e) {
        alert('Erro ao gerar a tabela QDG: ' + e.message);
    }
});

function mostrarTabelaQDG(tabela) {
    const div = document.getElementById('resultado');
    div.innerHTML = `
        <h2>Tabela QDG Gerada</h2>
        <table>
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
}
