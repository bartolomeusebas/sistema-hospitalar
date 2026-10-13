const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ mensagem: "Email e senha obrigatórios" });

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(401).json({ mensagem: "Usuário ou senha incorretos" });

        const senhaValida = await User.verifyPassword(user, senha);
        if (!senhaValida) return res.status(401).json({ mensagem: "Usuário ou senha incorretos" });

        const token = jwt.sign({ id: user.id, tipo: user.tipo, nome: user.nome }, JWT_SECRET, { expiresIn: "8h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 8 * 60 * 60 * 1000
        });
        res.json({ mensagem: "Login realizado com sucesso", user: { id: user.id, nome: user.nome, tipo: user.tipo } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ mensagem: "Logout realizado" });
};

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ mensagem: "Não autenticado" });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: "Token inválido" });
    }
};
