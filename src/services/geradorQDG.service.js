// src/services/geradorQDG.service.js

const Circuito = require('../models/Circuito');

class GeradorQDGService {
    constructor(comodos, tues = []) {
        this.comodos = comodos;
        this.tues = tues;
        this.circuitos = [];
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

            this.circuitos.push(new Circuito(
                numero++,
                `Iluminação - ${comodo.nome}`,
                comodo.tensao,
                comodo.potencia,
                correnteIluminacao,
                disjIluminacao,
                secaoIluminacao,
                '-',
            ));

            // Circuito de tomadas (TUG)
            const potenciaTomadas = comodo.tomadas * (comodo.tipoArea === 'molhada' ? 600 : 100);
            const correnteTomadas = Circuito.calcularCorrente(potenciaTomadas, comodo.tensao);
            const disjTomadas = Circuito.sugerirDisjuntor(correnteTomadas);

            let secaoTomadas = Circuito.sugerirSecao(correnteTomadas, potenciaTomadas, comodo.tensao);
            if (secaoTomadas < 2.5) secaoTomadas = 2.5;

            this.circuitos.push(new Circuito(
                numero++,
                `Tomadas - ${comodo.nome}`,
                comodo.tensao,
                potenciaTomadas,
                correnteTomadas,
                disjTomadas,
                secaoTomadas,
                comodo.tipoArea === 'molhada' ? '30 mA' : '-',
            ));
        }

        // ----------------------------
        // ADIÇÃO DAS TUEs (AJUSTADO)
        // ----------------------------
        for (const tue of this.tues) {
            // usar o campo correto vindo do modelo
            const tensao = tue.tensao || 127;

            const corrente = Circuito.calcularCorrente(tue.potencia, tensao);
            const disjuntor = Circuito.sugerirDisjuntor(corrente);

            let secao = Circuito.sugerirSecao(corrente, tue.potencia, tensao);
            if (secao < 2.5) secao = 2.5;

            // DR conforme regra simplificada
            const dr = tue.ambiente === 'molhada' ? '30 mA' : '-';

            this.circuitos.push(new Circuito(
                numero++,
                `TUE - ${tue.nome} (${tue.nomeComodo})`,
                tensao,
                tue.potencia,
                corrente,
                disjuntor,
                secao,
                dr
            ));
        }
        return this.circuitos;
    }


    gerarTabela() {
        const lista = this.gerar();
        const linhas = lista.map(c => {
            return {
                Circuito: c.numero,
                Descrição: c.descricao,
                Tensão: `${c.tensao}`,
                Potência: `${c.potencia}`,
                Corrente: `${c.corrente}`,
                Disjuntor: `${c.disjuntor}`,
                Seção: `${c.secao}`,
                DR: c.dr,
            };
        });

        return linhas;
    }
}

module.exports = GeradorQDGService;
