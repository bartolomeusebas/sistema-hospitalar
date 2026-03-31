const User = require("../models/user.model");

// Criar usuário
exports.createUser = (req, res) => {
    const user = req.body;
    User.create(user, (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.json({ mensagem: "Usuário criado com sucesso!" });
    });
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Buscar usuário por ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    User.getById(id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        if (results.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });
        res.json(results[0]);
    });
};

// Atualizar usuário
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const user = req.body;
    User.update(id, user, (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    });
};

// Deletar usuário
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    User.delete(id, (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.json({ mensagem: "Usuário removido com sucesso!" });
    });
};