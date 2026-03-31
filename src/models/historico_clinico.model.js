const db = require("../../service/database");

class HistoricoClinico {

    // Criar registro
    static create(dados, callback) {
        const sql = `
            INSERT INTO historico_clinico (paciente_id, descricao)
            VALUES (?, ?)
        `;

        db.query(sql, [
            dados.paciente_id,
            dados.descricao
        ], callback);
    }

    // Listar todos
    static getAll(callback) {
        const sql = `
            SELECT historico_clinico.*, pacientes.nome AS paciente_nome
            FROM historico_clinico
            JOIN pacientes ON historico_clinico.paciente_id = pacientes.id
        `;

        db.query(sql, callback);
    }

    // Buscar por ID
    static getById(id, callback) {
        const sql = "SELECT * FROM historico_clinico WHERE id=?";
        db.query(sql, [id], callback);
    }

    // Buscar por paciente
    static getByPaciente(paciente_id, callback) {
        const sql = "SELECT * FROM historico_clinico WHERE paciente_id=?";
        db.query(sql, [paciente_id], callback);
    }

    // Atualizar
    static update(id, dados, callback) {
        const sql = `
            UPDATE historico_clinico 
            SET descricao=? 
            WHERE id=?
        `;

        db.query(sql, [
            dados.descricao,
            id
        ], callback);
    }

    // Deletar
    static delete(id, callback) {
        const sql = "DELETE FROM historico_clinico WHERE id=?";
        db.query(sql, [id], callback);
    }
}

module.exports = HistoricoClinico;