const db = require("../../service/database");

const ResultadoIA = {
    create: async (resultado) => {
        const sql = `
            INSERT INTO resultados_ia (exame_id, diagnostico, probabilidade, observacao)
            VALUES (?, ?, ?, ?)
        `;
        return await db.execute(sql, [
            resultado.exame_id,
            resultado.diagnostico,
            resultado.probabilidade,
            resultado.observacao
        ]);
    },

    getAll: async () => {
        const sql = `
            SELECT resultados_ia.*, exames.tipo, exames.imagem, pacientes.nome AS paciente_nome
            FROM resultados_ia
            JOIN exames ON resultados_ia.exame_id = exames.id
            JOIN pacientes ON exames.paciente_id = pacientes.id
            ORDER BY resultados_ia.criado_em DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    getById: async (id) => {
        const sql = "SELECT * FROM resultados_ia WHERE id=?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    getByExame: async (exame_id) => {
        const sql = "SELECT * FROM resultados_ia WHERE exame_id=?";
        const [rows] = await db.execute(sql, [exame_id]);
        return rows;
    },

    delete: async (id) => {
        const sql = "DELETE FROM resultados_ia WHERE id=?";
        return await db.execute(sql, [id]);
    }
};

module.exports = ResultadoIA;