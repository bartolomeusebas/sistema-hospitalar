const db = require("../../service/database");

class Log {

    // Criar log
    static create(log, callback) {
        const sql = `
            INSERT INTO logs (usuario_id, acao)
            VALUES (?, ?)
        `;

        db.query(sql, [
            log.usuario_id,
            log.acao
        ], callback);
    }

    // Listar todos logs
    static getAll(callback) {
        const sql = `
            SELECT logs.*, users.nome AS usuario_nome
            FROM logs
            LEFT JOIN users ON logs.usuario_id = users.id
            ORDER BY logs.data_log DESC
        `;

        db.query(sql, callback);
    }

    // Buscar por ID
    static getById(id, callback) {
        const sql = "SELECT * FROM logs WHERE id=?";
        db.query(sql, [id], callback);
    }

    // Buscar por usuário
    static getByUser(usuario_id, callback) {
        const sql = "SELECT * FROM logs WHERE usuario_id=?";
        db.query(sql, [usuario_id], callback);
    }

    // Deletar (opcional)
    static delete(id, callback) {
        const sql = "DELETE FROM logs WHERE id=?";
        db.query(sql, [id], callback);
    }
}

module.exports = Log;