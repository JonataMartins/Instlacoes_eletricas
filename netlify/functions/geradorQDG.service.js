// src/services/geradorQDG.service.js

const Circuito = require('../../scr/models/Circuito');

class GeradorQDGService {
    constructor(comodos) {
        this.comodos = comodos;
        this.circuitos = [];
        this.barramentos = ['A', 'B', 'C'];
    }

    gerar() {
        let numero = 1;

        for (const comodo of this.comodos) {
            // Circuito de iluminação
            const correnteIluminacao = Circuito.calcularCorrente(comodo.potencia, 127);
            const disjIluminacao = Circuito.sugerirDisjuntor(correnteIluminacao);
            const secaoIluminacao = Circuito.sugerirSecao(correnteIluminacao);
            const barramentoIluminacao = this.sortearBarramento();

            this.circuitos.push(new Circuito(
                numero++,
                `Iluminação - ${comodo.nome}`,
                127,
                comodo.potencia,
                correnteIluminacao,
                disjIluminacao,
                secaoIluminacao,
                '-',
                barramentoIluminacao
            ));

            // Circuito de tomadas
            const potenciaTomadas = comodo.tomadas * (comodo.tipoArea === 'molhada' ? 600 : 100);
            const correnteTomadas = Circuito.calcularCorrente(potenciaTomadas, 127);
            const disjTomadas = Circuito.sugerirDisjuntor(correnteTomadas);
            const secaoTomadas = Circuito.sugerirSecao(correnteTomadas);
            const barramentoTomadas = this.sortearBarramento();

            this.circuitos.push(new Circuito(
                numero++,
                `Tomadas - ${comodo.nome}`,
                127,
                potenciaTomadas,
                correnteTomadas,
                disjTomadas,
                secaoTomadas,
                comodo.tipoArea === 'molhada' ? '30 mA' : '-',
                barramentoTomadas
            ));
        }

        return this.circuitos;
    }

    sortearBarramento() {
        // distribui os circuitos entre A, B e C
        const b = this.barramentos.shift();
        this.barramentos.push(b);
        return b;
    }

    gerarTabela() {
        const lista = this.gerar();
        const linhas = lista.map(c => {
            return {
                Circuito: c.numero,
                Descrição: c.descricao,
                Tensão: `${c.tensao} V`,
                Potência: `${c.potencia} VA`,
                Corrente: `${c.corrente} A`,
                Disjuntor: `${c.disjuntor} A`,
                Seção: `${c.secao} mm²`,
                DR: c.dr,
                Barramento: c.barramento
            };
        });

        return linhas;
    }
}

module.exports = GeradorQDGService;
