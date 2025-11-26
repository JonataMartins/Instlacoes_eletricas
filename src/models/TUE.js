class TUE {
    constructor(nome, nomeComodo, potencia, tensao) {
        this.nome = nome;                     
        this.nomeComodo = nomeComodo;         
        this.potencia = parseFloat(potencia);
        this.tensao = parseInt(tensao) || 127;
    }
}

module.exports = TUE;
