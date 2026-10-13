const User = require('../models/user.model');

exports.createUser = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({
                erro: 'Nome, email, senha e tipo são obrigatórios'
            });
        }

        const user = await User.create({
            nome,
            email,
            senha,
            tipo
        });

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: user
        });
    } catch (err) {
        console.error(err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                erro: 'O email informado já está registado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao criar usuário'
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: 'Erro ao consultar usuários'
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.getById(req.params.id);

        if (!user) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: 'Erro ao consultar usuário'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, tipo } = req.body;

        const existingUser = await User.getById(id);

        if (!existingUser) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        await User.update(id, {
            nome: nome ?? existingUser.nome,
            email: email ?? existingUser.email,
            senha: senha ?? existingUser.senha,
            tipo: tipo ?? existingUser.tipo
        });

        res.json({
            mensagem: 'Usuário atualizado com sucesso!'
        });
    } catch (err) {
        console.error(err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                erro: 'O email informado já está registado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao atualizar usuário'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json({
            mensagem: 'Usuário removido com sucesso!'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: 'Erro ao remover usuário'
        });
    }
};