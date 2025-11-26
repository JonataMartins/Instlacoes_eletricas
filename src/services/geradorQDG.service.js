// src/services/geradorQDG.service.js

const Circuito = require('../models/Circuito');

class GeradorQDGService {
    constructor(comodos, tues = []) {
        this.comodos = comodos;
        this.tues = tues;
        this.circuitos = [];
        this.barramentos = ['A', 'B', 'C'];
    }

    gerar() {
        let numero = 1;

        // ----------------------------
        // ILUMINAÇÃO E TOMADAS (SEM ALTERAR)
        // ----------------------------
        for (const comodo of this.comodos) {

            // Circuito de iluminação
            const correnteIluminacao = Circuito.calcularCorrente(comodo.potencia, comodo.tensao);
            const disjIluminacao = Circuito.sugerirDisjuntor(correnteIluminacao);
            const secaoIluminacao = Circuito.sugerirSecao(correnteIluminacao, comodo.potencia, comodo.tensao);
            const barramentoIluminacao = this.sortearBarramento();

            this.circuitos.push(new Circuito(
                numero++,
                `Iluminação - ${comodo.nome}`,
                comodo.tensao,
                comodo.potencia,
                correnteIluminacao,
                disjIluminacao,
                secaoIluminacao,
                '-',
                barramentoIluminacao
            ));

            // Circuito de tomadas (TUG)
            const potenciaTomadas = comodo.tomadas * (comodo.tipoArea === 'molhada' ? 600 : 100);
            const correnteTomadas = Circuito.calcularCorrente(potenciaTomadas, comodo.tensao);
            const disjTomadas = Circuito.sugerirDisjuntor(correnteTomadas);

            let secaoTomadas = Circuito.sugerirSecao(correnteTomadas, potenciaTomadas, comodo.tensao);
            if (secaoTomadas < 2.5) secaoTomadas = 2.5;

            const barramentoTomadas = this.sortearBarramento();

            this.circuitos.push(new Circuito(
                numero++,
                `Tomadas - ${comodo.nome}`,
                comodo.tensao,
                potenciaTomadas,
                correnteTomadas,
                disjTomadas,
                secaoTomadas,
                comodo.tipoArea === 'molhada' ? '30 mA' : '-',
                barramentoTomadas
            ));
        }

        // ----------------------------
        // ADIÇÃO DAS TUEs (AJUSTADO)
        // ----------------------------
        for (const tue of this.tues) {

            const tensao = tue.tensao || 127; // default caso não venha do front

            const corrente = Circuito.calcularCorrente(tue.potencia, tensao);
            const disjuntor = Circuito.sugerirDisjuntor(corrente);

            let secao = Circuito.sugerirSecao(corrente, tue.potencia, tensao);
            if (secao < 2.5) secao = 2.5;

            const barramento = this.sortearBarramento();

            // DR conforme regra simplificada solicitada
            const dr = tue.ambiente === 'molhado' ? '30 mA' : '-';

            this.circuitos.push(new Circuito(
                numero++,
                `TUE - ${tue.nome} (${tue.nomeComodo})`,
                tensao,
                tue.potencia,
                corrente,
                disjuntor,
                secao,
                dr,
                barramento
            ));
        }
        return this.circuitos;
    }

    sortearBarramento() {
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
