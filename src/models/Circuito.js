// src/models/Circuito.js

class Circuito {
    constructor(numero, descricao, tensao, potencia, corrente, disjuntor, secao, dr, barramento) {
        this.numero = numero;       // Ex: 1
        this.descricao = descricao; // Ex: "Iluminação Sala"
        this.tensao = tensao;       // Ex: 127 ou 220
        this.potencia = potencia;   // VA
        this.corrente = corrente;   // A
        this.disjuntor = disjuntor; // A
        this.secao = secao;         // mm²
        this.dr = dr || '-';        // Ex: "30 mA" ou "-"
        this.barramento = barramento; // "A", "B" ou "C"
    }

    static calcularCorrente(potencia, tensao) {
        return (potencia / tensao).toFixed(2);
    }

    static sugerirDisjuntor(corrente) {
        // Disjuntores padronizados: 10, 16, 20, 25, 32, 40...
        const padroes = [10, 16, 20, 25, 32, 40, 50, 63];
        return padroes.find(d => d >= corrente) || 63;
    }

    static sugerirSecao(corrente) {
        // Base simplificada conforme NBR 5410 (cobre)
        if (corrente <= 15) return 1.5;
        if (corrente <= 20) return 2.5;
        if (corrente <= 25) return 4;
        if (corrente <= 32) return 6;
        if (corrente <= 40) return 10;
        return 16;
    }
}

module.exports = Circuito;
