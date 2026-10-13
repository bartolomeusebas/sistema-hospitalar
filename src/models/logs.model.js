const db = require("../../service/database");

const Log = {
    create: async (log) => {
        const sql = `INSERT INTO logs (usuario_id, acao) VALUES (?, ?)`;
        return await db.execute(sql, [log.usuario_id, log.acao]);
    },

    getAll: async () => {
        const sql = `
            SELECT logs.*, users.nome AS usuario_nome
            FROM logs
            LEFT JOIN users ON logs.usuario_id = users.id
            ORDER BY logs.data_log DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    getById: async (id) => {
        const sql = "SELECT * FROM logs WHERE id=?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    getByUser: async (usuario_id) => {
        const sql = "SELECT * FROM logs WHERE usuario_id=? ORDER BY data_log DESC";
        const [rows] = await db.execute(sql, [usuario_id]);
        return rows;
    },

    delete: async (id) => {
        const sql = "DELETE FROM logs WHERE id=?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Log;