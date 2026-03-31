const Exame = require("../models/exames.model");

module.exports = {
  create: async (req, res) => {
    try {
      const data = {
        paciente_id: req.body.paciente_id,
        usuario_id: req.body.usuario_id, // pode vir do usuário logado
        tipo: req.body.tipo,
        imagem: req.file ? req.file.filename : null,
        data_exame: new Date() // data do sistema
      };

      const [result] = await Exame.create(data); // mysql2 promise
      res.json({ mensagem: "Exame cadastrado com sucesso!", id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: err.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const [exames] = await Exame.getAll();
      res.json(exames);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  findById: async (req, res) => {
    try {
      const [exame] = await Exame.getById(req.params.id);
      if (!exame.length) return res.status(404).json({ mensagem: "Exame não encontrado" });
      res.json(exame[0]);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Exame.delete(req.params.id);
      res.json({ mensagem: "Exame deletado com sucesso!" });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
};