// src/controllers/comodos.controller.js

const Comodo = require('../models/Comodo');
const GeradorQDGService = require('../functions/geradorQDG.service');

class ComodosController {
    static gerarTabela(req, res) {
        try {
            const { comodos } = req.body;

            if (!comodos || !Array.isArray(comodos)) {
                return res.status(400).json({ erro: 'Lista de cômodos inválida' });
            }

            // Cria os objetos de cômodo
            const listaComodos = comodos.map(c => new Comodo(
                c.nome,
                c.tipoArea,
                c.comprimento,
                c.largura
            ));

            // Gera a tabela QDG
            const gerador = new GeradorQDGService(listaComodos);
            const tabela = gerador.gerarTabela();

            return res.json({ tabela });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao gerar a tabela QDG' });
        }
    }
}

module.exports = ComodosController;
