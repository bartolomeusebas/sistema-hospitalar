const db = require("../../service/database");

const HistoricoClinico = {
    create: async (dados) => {
        const sql = `INSERT INTO historico_clinico (paciente_id, descricao) VALUES (?, ?)`;
        return await db.execute(sql, [dados.paciente_id, dados.descricao]);
    },

    getByPaciente: async (paciente_id) => {
        const sql = `SELECT * FROM historico_clinico WHERE paciente_id = ? ORDER BY id DESC`;
        const [rows] = await db.execute(sql, [paciente_id]);
        return rows;
    },

    getAll: async () => {
        const sql = `SELECT historico_clinico.*, pacientes.nome AS paciente_nome
                     FROM historico_clinico
                     JOIN pacientes ON historico_clinico.paciente_id = pacientes.id`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    getById: async (id) => {
        const sql = "SELECT * FROM historico_clinico WHERE id=?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    update: async (id, dados) => {
        const sql = `UPDATE historico_clinico SET descricao=? WHERE id=?`;
        return await db.execute(sql, [dados.descricao, id]);
    },

    delete: async (id) => {
        const sql = "DELETE FROM historico_clinico WHERE id=?";
        return await db.execute(sql, [id]);
    }
};

module.exports = HistoricoClinico;