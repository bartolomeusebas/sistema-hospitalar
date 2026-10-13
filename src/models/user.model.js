const db = require('../../service/database');
const bcrypt = require('bcryptjs');

class User {
    static async getAll() {
        const [rows] = await db.query(
            'SELECT id, nome, email, tipo FROM users ORDER BY id DESC'
        );

        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email, tipo FROM users WHERE id = ?',
            [id]
        );

        return rows[0] || null;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email, senha, tipo FROM users WHERE email = ?',
            [email]
        );

        return rows[0] || null;
    }

    static async verifyPassword(user, password) {
        return bcrypt.compare(password, user.senha);
    }

    static async create(user) {
        const { nome, email, senha, tipo } = user;

        const passwordHash = await bcrypt.hash(senha, 12);
        const [result] = await db.query(
            'INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
            [nome, email, passwordHash, tipo]
        );

        return {
            id: result.insertId,
            nome,
            email,
            tipo
        };
    }

    static async update(id, user) {
        const { nome, email, senha, tipo } = user;
        const passwordHash = senha ? await bcrypt.hash(senha, 12) : undefined;

        const [result] = await db.query(
            `
            UPDATE users
            SET nome = ?, email = ?, senha = ?, tipo = ?
            WHERE id = ?
            `,
            [nome, email, passwordHash, tipo, id]
        );

        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        return result;
    }
}

module.exports = User;