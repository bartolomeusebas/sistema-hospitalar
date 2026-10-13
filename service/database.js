const mysql = require("mysql2");

// POOL DE CONEXÕES
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "medicos",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise
const db = pool.promise();

// Testar conexão
db.getConnection()
    .then(conn => {
        console.log("Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.log("Erro MySQL:", err);
    });

module.exports = db;