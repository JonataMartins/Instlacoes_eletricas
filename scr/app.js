const express = require('express');
const path = require('path');
const app = express();
const comodosRoutes = require('./routes/comodos.routes');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/comodos', comodosRoutes);

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
