const Exame = require("../models/exames.model");

module.exports = {
  create: async (req, res) => {
    try {
      const data = {
        paciente_id: req.body.paciente_id,
        usuario_id: req.user?.id || req.body.usuario_id || null,
        tipo: req.body.tipo,
        imagem: req.file ? req.file.filename : null,
        data_exame: req.body.data_exame || new Date()
      };

      if (!data.paciente_id || !data.usuario_id || !data.tipo) {
        return res.status(400).json({ erro: "Paciente, utilizador e tipo de exame são obrigatórios." });
      }

      const [result] = await Exame.create(data); // mysql2 promise
      res.status(201).json({ mensagem: "Exame cadastrado com sucesso!", id: result.insertId });
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
      const exame = await Exame.getById(req.params.id);
      if (!exame) return res.status(404).json({ mensagem: "Exame não encontrado" });
      res.json(exame);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const [result] = await Exame.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Exame não encontrado" });
      }
      res.json({ mensagem: "Exame deletado com sucesso!" });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
};