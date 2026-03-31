const express = require('express');
const app = express();
// 🔌 IMPORTAR CONEXÃO
const db = require("./service/database");
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
const path = require('path');

const userRoute = require("./src/routes/user.routes");
app.use(userRoute);
const pacienteRoute = require("./src/routes/paciente.route");
app.use("/pacientes", pacienteRoute);
const exameRoute = require("./src/routes/exames.route");
app.use("/exames", exameRoute);
const resultadoRoute = require("./src/routes/resultados_ia.route");
app.use(resultadoRoute);
const historicoRoute = require("./src/routes/historico_clinico.route");
app.use(historicoRoute);
const logRoute = require("./src/routes/logs.route");
app.use(logRoute);

// servir pasta public
app.use(express.static(path.join(__dirname, 'public')));;
// rota para o menu
app.get("/menu.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "menu.html"));
});

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// rotas para páginas HTML
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "dashboard.html"));
});

app.get("/exames.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "exames.html"));
});

app.get("/pacientes.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "pacientes.html"));
});

app.get("/resultados_ia.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "resultados_ia.html"));
});

app.get("/historico_clinico.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "historico_clinico.html"));
});

app.get("/usuarios.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "usuarios.html"));
});

app.get("/logs.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "users", "logs.html"));
});

app.use(userRoute);

app.get('/', (req, res) => {
    res.send('Servidor está a funcionar');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});