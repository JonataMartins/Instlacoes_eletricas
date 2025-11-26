class Circuito {
    constructor(numero, descricao, tensao, potencia, corrente, disjuntor, secao, dr) {
        this.numero = numero;       // Ex: 1
        this.descricao = descricao; // Ex: "Iluminação Sala"
        this.tensao = tensao;       // Ex: 127 ou 220
        this.potencia = potencia;   // VA
        this.corrente = corrente;   // A (número)
        this.disjuntor = disjuntor; // A
        this.secao = secao;         // mm²
        this.dr = dr || '-';        // Ex: "30 mA" ou "-"
    }

    static calcularCorrente(potencia, tensao) {
        // retorna número, com 2 casas (não string)
        const val = potencia / tensao;
        return parseFloat(val.toFixed(2));
    }

    static sugerirDisjuntor(corrente) {
        // Disjuntores padronizados: 10, 16, 20, 25, 32, 40...
        const padroes = [10, 16, 20, 25, 32, 40, 50, 63];
        // garante que corrente seja número
        const c = Number(corrente);
        return padroes.find(d => d >= c) || 63;
    }

    static sugerirSecao(corrente, potencia = 0, tensao = 127) {
        // corrente como número
        const c = Number(corrente);

        // Base simplificada conforme NBR 5410 (cobre) — seleção inicial por corrente
        let secao;
        if (c <= 15) secao = 1.5;
        else if (c <= 20) secao = 2.5;
        else if (c <= 25) secao = 4;
        else if (c <= 32) secao = 6;
        else if (c <= 40) secao = 10;
        else secao = 16;

        // REGRA ADICIONAL (Opção B - segura): para TUEs de potência elevada,
        const pot = Number(potencia);
        const tens = Number(tensao);

        if (pot >= 3500 && tens === 220 && secao < 6) {
            secao = 6;
        }

        return secao;
    }
}

module.exports = Circuito;
