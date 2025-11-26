// src/controllers/comodos.controller.js

const Comodo = require('../models/Comodo');
const TUE = require('../models/TUE');
const GeradorQDGService = require('../services/geradorQDG.service');

class ComodosController {
    static gerarTabela(req, res) {
        try {
            const { comodos, tues } = req.body;

            // validação dos cômodos
            if (!comodos || !Array.isArray(comodos)) {
                return res.status(400).json({ erro: 'Lista de cômodos inválida' });
            }

            // cria os objetos de cômodo
            const listaComodos = comodos.map(c => new Comodo(
                c.nome,
                c.tipoArea,
                c.tensao,
                c.comprimento,
                c.largura
            ));

            const listaTUEs = Array.isArray(tues)
                ? tues.map(t => new TUE(
                    t.nome,
                    t.nomeComodo,
                    t.potencia,
                    t.tensaoT,
                    t.ambiente
                ))
                : [];


            // gera a tabela QDG incluindo TUEs
            const gerador = new GeradorQDGService(listaComodos, listaTUEs);
            const tabela = gerador.gerarTabela();

            return res.json({ tabela });

        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao gerar a tabela QDG' });
        }
    }
}

module.exports = ComodosController;
