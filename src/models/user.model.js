const db = require("../../service/database"); // ajusta o caminho se necessário

class User {

    // Criar usuário
    static create(user, callback) {
        const sql = `INSERT INTO users (nome, email, senha, tipo)
                     VALUES (?, ?, ?, ?)`;
        db.query(sql, [user.nome, user.email, user.senha, user.tipo], callback);
    }

    // Listar todos os usuários
    async getAll() {
        const [rows] = await connection.query("SELECT * FROM users");
        return rows;
    }

    // Buscar usuário por ID
    static getById(id, callback) {
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Atualizar usuário
    static update(id, user, callback) {
        const sql = `UPDATE users SET nome=?, email=?, senha=?, tipo=? WHERE id=?`;
        db.query(sql, [user.nome, user.email, user.senha, user.tipo, id], callback);
    }

    // Deletar usuário
    static delete(id, callback) {
        const sql = "DELETE FROM users WHERE id=?";
        db.query(sql, [id], callback);
    }
}

module.exports = User;