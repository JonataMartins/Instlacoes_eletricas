class Comodo {
    constructor(nome, tipoArea, tensao, comprimento, largura) {
        this.nome = nome;
        this.tipoArea = tipoArea === 'molhada' ? 'molhada' : 'seca';
        this.tensao = parseInt(tensao);

        this.comprimento = parseFloat(comprimento);
        this.largura = parseFloat(largura);

        this.area = this.calcularArea();
        this.potencia = this.estimarPotencia();
        this.tomadas = this.estimarTomadas();
    }

    calcularArea() {
        return parseFloat((this.comprimento * this.largura).toFixed(2));
    }

    // NBR 5410 — iluminação mínima
    estimarPotencia() {
        if (this.tipoArea === 'molhada') return 600; // regra da norma
        const potencia = Math.ceil(this.area / 4) * 100;
        return potencia < 100 ? 100 : potencia;
    }

    // NBR 5410 — tomadas mínimas por m²
    estimarTomadas() {
        return Math.max(1, Math.ceil(this.area / 5));
    }
}

module.exports = Comodo;
