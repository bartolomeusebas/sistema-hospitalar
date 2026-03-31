const db = require("../../service/database");

const Exame = {
    create: (data) => {
        const { paciente_id, usuario_id, tipo, imagem, data_exame } = data;
        return db.execute(
            `INSERT INTO exames (paciente_id, usuario_id, tipo, imagem, data_exame) 
             VALUES (?, ?, ?, ?, ?)`,
            [paciente_id, usuario_id, tipo, imagem, data_exame || new Date()]
        );
    },
    getById: (id) => db.execute(`
    SELECT e.id, p.nome AS paciente, u.nome AS usuario, e.tipo, e.imagem, e.data_exame
    FROM exames e
    JOIN pacientes p ON e.paciente_id = p.id
    JOIN users u ON e.usuario_id = u.id
    WHERE e.id = ?
`, [id]),
    getAll: () => db.execute(`
        SELECT e.id, p.nome AS paciente, u.nome AS usuario, e.tipo, e.imagem, e.data_exame
        FROM exames e
        JOIN pacientes p ON e.paciente_id = p.id
        JOIN users u ON e.usuario_id = u.id
    `),
    delete: (id) => db.execute("DELETE FROM exames WHERE id=?", [id])
};

module.exports = Exame;