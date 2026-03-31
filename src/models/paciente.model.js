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
        const { nome, sexo, data_nascimento, telefone, endereco } = data;

        const [result] = await db.execute(
            `INSERT INTO pacientes (nome, sexo, data_nascimento, telefone, endereco) 
             VALUES (?, ?, ?, ?, ?)`,
            [nome, sexo, data_nascimento, telefone, endereco]
        );

        return result;
    },

    update: async (id, data) => {
        const { nome, sexo, data_nascimento, telefone, endereco } = data;

        await db.execute(
            `UPDATE pacientes 
             SET nome=?, sexo=?, data_nascimento=?, telefone=?, endereco=? 
             WHERE id=?`,
            [nome, sexo, data_nascimento, telefone, endereco, id]
        );
    },

    delete: async (id) => {
        await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
    }

};

module.exports = Paciente;