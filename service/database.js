const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medicos"
});

// Ative o suporte a promise
const db = connection.promise();

db.connect()
  .then(() => console.log("Conectado ao MySQL com sucesso!"))
  .catch(err => console.error("Erro ao conectar na base de dados:", err));

module.exports = db;