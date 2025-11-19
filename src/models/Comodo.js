// src/models/Comodo.js

class Comodo {
    constructor(nome, tipoArea, comprimento, largura) {
        this.nome = nome;                 // Ex: "Cozinha"
        this.tipoArea = tipoArea;         // "seca" ou "molhada"
        this.comprimento = parseFloat(comprimento);
        this.largura = parseFloat(largura);

        this.area = this.calcularArea();
        this.potencia = this.estimarPotencia();
        this.tomadas = this.estimarTomadas();
    }

    calcularArea() {
        return (this.comprimento * this.largura).toFixed(2);
    }

    estimarPotencia() {
        // Baseado em NBR 5410 (valores aproximados)
        // Áreas secas: 100 VA por 4 m², mínimo 100 VA
        // Áreas molhadas: 600 VA mínimo
        if (this.tipoArea === 'molhada') return 600;
        const potencia = Math.ceil(this.area / 4) * 100;
        return potencia < 100 ? 100 : potencia;
    }

    estimarTomadas() {
        // Simplificação: 1 tomada a cada 5 m² (mínimo 1)
        return Math.max(1, Math.ceil(this.area / 5));
    }
}

module.exports = Comodo;
