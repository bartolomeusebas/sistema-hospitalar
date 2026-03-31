const db = require("../../service/database");

class ResultadoIA {

    // Criar resultado
    static create(resultado, callback) {
        const sql = `
            INSERT INTO resultados_ia (exame_id, diagnostico, probabilidade, observacao)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [
            resultado.exame_id,
            resultado.diagnostico,
            resultado.probabilidade,
            resultado.observacao
        ], callback);
    }

    // Listar todos
    static getAll(callback) {
        const sql = `
            SELECT resultados_ia.*, exames.tipo, exames.imagem
            FROM resultados_ia
            JOIN exames ON resultados_ia.exame_id = exames.id
        `;
        db.query(sql, callback);
    }

    // Buscar por ID
    static getById(id, callback) {
        const sql = "SELECT * FROM resultados_ia WHERE id=?";
        db.query(sql, [id], callback);
    }

    // Buscar por exame
    static getByExame(exame_id, callback) {
        const sql = "SELECT * FROM resultados_ia WHERE exame_id=?";
        db.query(sql, [exame_id], callback);
    }

    // Deletar
    static delete(id, callback) {
        const sql = "DELETE FROM resultados_ia WHERE id=?";
        db.query(sql, [id], callback);
    }
}

module.exports = ResultadoIA;