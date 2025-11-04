// src/routes/comodos.routes.js

const express = require('express');
const router = express.Router();
const ComodosController = require('../controllers/comodos.controller');

// POST /comodos/gerarQDG
router.post('/gerarQDG', ComodosController.gerarTabela);

module.exports = router;
