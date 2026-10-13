const mysql = require("mysql2");

// POOL DE CONEXÕES
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "medicos",

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