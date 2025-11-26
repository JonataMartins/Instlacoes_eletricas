class TUE {
    constructor(nome, nomeComodo, potencia, tensaoT, ambiente) {
        this.nome = nome;                     // nome da TUE (ex: Micro-ondas)
        this.nomeComodo = nomeComodo;         // cômodo onde está instalada
        this.potencia = parseFloat(potencia); // VA
        this.tensao = parseInt(tensaoT) || 127; // tensão independente do cômodo
        this.ambiente = ambiente === 'molhada' ? 'molhada' : 'seco'; // DR depende disso
    }
}

module.exports = TUE;
