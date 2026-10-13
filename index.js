require('dotenv').config();
require('dotenv').config({ path: 'iafile.env', override: false });

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

require('./service/database');

const authRoutes = require('./src/routes/auth.routes');
const resultadoRoute = require('./src/routes/resultados_ia.route');
const userRoute = require('./src/routes/user.routes');
const pacienteRoute = require('./src/routes/paciente.route');
const exameRoute = require('./src/routes/exames.route');
const historicoRoute = require('./src/routes/historico_clinico.route');
const logRoute = require('./src/routes/logs.route');
const logMiddleware = require('./src/middlewares/logMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const frontendDist = path.join(__dirname, 'public', 'dist');
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Ficheiros estáticos
app.use(express.static(frontendDist));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware de logs aplicado às APIs
app.use(logMiddleware);

// Rotas da API
app.use('/auth', authRoutes);
app.use('/resultados', resultadoRoute);
app.use('/usuarios', userRoute);
app.use('/pacientes', pacienteRoute);
app.use('/exames', exameRoute);
app.use('/historico', historicoRoute);
app.use('/logs', logRoute);

// Páginas HTML
const pages = [
    'menu',
    'dashboard',
    'exames',
    'pacientes',
    'resultados_ia',
    'historico_clinico',
    'usuarios',
    'logs'
];

pages.forEach((page) => {
    app.get(`/${page}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'users', `${page}.html`));
    });
});

// Rota inexistente
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        rota: req.originalUrl
    });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        erro: err.message || 'Erro interno do servidor'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});