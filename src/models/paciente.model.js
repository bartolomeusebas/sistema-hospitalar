const db = require("../../service/database");

const Paciente = {

    getAll: async () => {
        const [rows] = await db.execute("SELECT * FROM pacientes");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.execute("SELECT * FROM pacientes WHERE id=?", [id]);
        return rows[0];
    },

    create: async (data) => {
        const {
            nome, sexo, data_nascimento, telefone, endereco,
            tipo_sanguineo, alergias, medico_responsavel, condicoes_ativas
        } = data;

        const [result] = await db.execute(
            `INSERT INTO pacientes
             (nome, sexo, data_nascimento, telefone, endereco, tipo_sanguineo, alergias, medico_responsavel, condicoes_ativas)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, sexo, data_nascimento, telefone, endereco, tipo_sanguineo || null, alergias || null, medico_responsavel || null, condicoes_ativas || null]
        );

        return result;
    },

    update: async (id, data) => {
        const {
            nome, sexo, data_nascimento, telefone, endereco,
            tipo_sanguineo, alergias, medico_responsavel, condicoes_ativas
        } = data;

        const [result] = await db.execute(
            `UPDATE pacientes 
            SET nome=?, sexo=?, data_nascimento=?, telefone=?, endereco=?
                , tipo_sanguineo=?, alergias=?, medico_responsavel=?, condicoes_ativas=?
             WHERE id=?`,
            [nome, sexo, data_nascimento, telefone, endereco, tipo_sanguineo || null, alergias || null, medico_responsavel || null, condicoes_ativas || null, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
        return result;
    }

};

module.exports = Paciente;